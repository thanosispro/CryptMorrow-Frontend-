import axios from 'axios';
import * as dfd from 'danfojs-node';
// import talib from 'talib'; // Commented out for now until we confirm if we need it here or if DanfoJS is enough

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { symbol, timeframe, limit } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    try {
        // 1. Validate user and get limits from Django
        const djangoRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/market/is_auth_to_market_data/`, {}, {
            headers: {
                'Authorization': authHeader
            }
        });

        if (djangoRes.status !== 200) {
            return res.status(djangoRes.status).json(djangoRes.data);
        }

        const { max_limit } = djangoRes.data;

        // 2. Validate requested limit against user's max limit
        const requestedLimit = parseInt(limit || 100);
        if (requestedLimit > max_limit) {
            return res.status(403).json({
                error: `Limit exceeded for your membership type. Max allowed is ${max_limit}.`
            });
        }

        // 3. Fetch data from Binance
        // Map Cryptocompare timeframe names to Binance if necessary
        // Binance intervals: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
        // If user sends 'histoday', it should be '1d'. If 'histohour', it should be '1h'.
        let interval = timeframe;
        if (timeframe === 'histoday') interval = '1d';
        if (timeframe === 'histohour') interval = '1h';

        const klineData = await getHistoricalKlines(symbol, interval, requestedLimit);

        // 4. Processing Indicators manually for reliability
        let df = new dfd.DataFrame(klineData);
        const o = df['open'].values;
        const h = df['high'].values;
        const l = df['low'].values;
        const c = df['close'].values;

        // MACD
        const { macd, signal } = calculateMACD(c);

        // Bollinger Bands
        const { upper, middle, lower } = calculateBollingerBands(c, 20);

        // Patterns
        const pattern_doji = [];
        const pattern_hammer = [];

        for (let i = 0; i < c.length; i++) {
            const bodySize = Math.abs(c[i] - o[i]);
            const rangeSize = h[i] - l[i];
            const lowerWickSize = Math.min(o[i], c[i]) - l[i];
            const upperWickSize = h[i] - Math.max(o[i], c[i]);

            pattern_doji.push(rangeSize > 0 ? (bodySize / rangeSize <= 0.1) : false);
            pattern_hammer.push((lowerWickSize > (bodySize * 2)) && (upperWickSize < bodySize));
        }

        // Add back to DataFrame for tail slicing and JSON conversion
        df.addColumn('macd', macd, { inplace: true });
        df.addColumn('macd_signal', signal, { inplace: true });
        df.addColumn('bb_upper', upper, { inplace: true });
        df.addColumn('bb_middle', middle, { inplace: true });
        df.addColumn('bb_lower', lower, { inplace: true });
        df.addColumn('pattern_doji', pattern_doji, { inplace: true });
        df.addColumn('pattern_hammer', pattern_hammer, { inplace: true });

        // Slice to requested limit and convert back to JSON
        let processedData = dfd.toJSON(df.tail(requestedLimit));

        res.status(200).json({
            status: 'success',
            symbol: symbol,
            count: processedData.length,
            data: processedData
        });

    } catch (error) {
        console.error('Error in proxy API:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.error || 'Internal server error'
        });
    }
}

async function getHistoricalKlines(symbol, interval, limit = 500) {
    let allKlines = [];
    let endTime = Date.now();
    const batchSize = 1000; // Binance max limit per request

    // Ensure we fetch at least enough to calculate indicators if needed (e.g., +50)
    const targetCount = limit + 50;

    while (allKlines.length < targetCount) {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
            params: {
                symbol: symbol,
                interval: interval,
                limit: batchSize,
                endTime: endTime
            }
        });

        const data = response.data; // Array of arrays: [time, open, high, low, close, volume, ...]
        if (data.length === 0) break;

        // Map Binance format to a more readable object format
        const formattedData = data.map(k => ({
            time: k[0] / 1000, // Convert to seconds for consistency with old API
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
            volumefrom: parseFloat(k[5]),
        }));

        // Add to array and update endTime to the time of the oldest candle received
        allKlines = [...formattedData, ...allKlines];
        endTime = data[0][0] - 1;

        if (allKlines.length >= targetCount) break;

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allKlines.slice(-limit);
}

function calculateEMA(data, period) {
    const k = 2 / (period + 1);
    let ema = new Array(data.length).fill(null);
    let sum = 0;
    for (let i = 0; i < period; i++) sum += data[i];
    ema[period - 1] = sum / period;

    for (let i = period; i < data.length; i++) {
        ema[i] = data[i] * k + ema[i - 1] * (1 - k);
    }
    return ema;
}

function calculateMACD(data) {
    const ema12 = calculateEMA(data, 12);
    const ema26 = calculateEMA(data, 26);
    const macd = new Array(data.length).fill(null);
    const signal = new Array(data.length).fill(null);

    for (let i = 25; i < data.length; i++) {
        macd[i] = ema12[i] - ema26[i];
    }

    const macdValid = macd.slice(25).filter(v => v !== null);
    const signalEMARaw = calculateEMA(macdValid, 9);

    let signalIndex = 0;
    for (let i = 25 + 8; i < data.length; i++) {
        signal[i] = signalEMARaw[signalIndex++];
    }

    return { macd, signal };
}

function calculateBollingerBands(data, period = 20) {
    const upper = new Array(data.length).fill(null);
    const middle = new Array(data.length).fill(null);
    const lower = new Array(data.length).fill(null);

    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / period;
        const std = Math.sqrt(slice.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / period);
        middle[i] = mean;
        upper[i] = mean + (std * 2);
        lower[i] = mean - (std * 2);
    }

    return { upper, middle, lower };
}

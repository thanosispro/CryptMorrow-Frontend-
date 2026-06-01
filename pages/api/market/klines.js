import axios from 'axios';

import { MACD, BollingerBands, doji, hammerpattern } from 'technicalindicators';
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
        let interval = timeframe;
        if (timeframe === 'histoday') interval = '1d';
        if (timeframe === 'histohour') interval = '1h';

        // Increased buffer for indicator warm-up (MACD needs ~100 to stabilize)
        const fetchLimit = requestedLimit + 100;
        const klineData = await getHistoricalKlines(symbol, interval, fetchLimit);

        // 4. Processing Indicators with technicalindicators
        const prices = klineData.map(d => d.close);
        const opens = klineData.map(d => d.open);
        const highs = klineData.map(d => d.high);
        const lows = klineData.map(d => d.low);

        // MACD
        const macdResults = MACD.calculate({
            values: prices,
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        });

        // Bollinger Bands
        const bbResults = BollingerBands.calculate({
            period: 20,
            values: prices,
            stdDev: 2
        });

        // Map results back to the original array (matching from the end)
        const processedFull = klineData.map((d, i) => {
            // Signal and result alignment:
            // The library returns results only for valid windows.
            // Result index = input index - (input length - result length)
            
            const macdOffset = prices.length - macdResults.length;
            const bbOffset = prices.length - bbResults.length;

            const macdEntry = i >= macdOffset ? macdResults[i - macdOffset] : null;
            const bbEntry = i >= bbOffset ? bbResults[i - bbOffset] : null;

            // Patterns
            const candle = { open: [opens[i]], high: [highs[i]], low: [lows[i]], close: [prices[i]] };
            const pattern_doji = doji(candle);
            const pattern_hammer = hammerpattern(candle);

            return {
                ...d,
                macd: macdEntry ? macdEntry.MACD : 'N/A',
                macd_signal: macdEntry ? macdEntry.signal : 'N/A',
                bb_upper: bbEntry ? bbEntry.upper : 'N/A',
                bb_middle: bbEntry ? bbEntry.middle : 'N/A',
                bb_lower: bbEntry ? bbEntry.lower : 'N/A',
                pattern_doji: pattern_doji ? "TRUE" : "FALSE",
                pattern_hammer: pattern_hammer ? "TRUE" : "FALSE"
            };
        });

        // Important: result should only contain the requested amount of data
        const processedData = processedFull.slice(-requestedLimit);

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

    // Fetch enough to satisfy the request
    while (allKlines.length < limit) {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
            params: {
                symbol: symbol,
                interval: interval,
                limit: Math.min(batchSize, limit - allKlines.length + 50), // Fetch a bit extra to be safe
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

        if (allKlines.length >= limit) break;

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allKlines.slice(-limit);
}


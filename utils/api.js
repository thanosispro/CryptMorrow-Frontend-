import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetches prediction data from the backend.
 */
export const fetchPrediction = async (coin, timeframe, tsym = 'USD') => {
  const token = Cookies.get('cryptmorrow_access_token');
  const res = await fetch(`${API_URL}/training/get-prediction/?crypto_name=${coin}&timeframe=${timeframe}&tsym=${tsym}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch prediction.");
  }

  return await res.json();
};

/**
 * Fetches the current user profile from the backend.
 */
export const fetchUserProfile = async () => {
  const token = Cookies.get('cryptmorrow_access_token');
  if (!token) return null;

  const res = await fetch(`${API_URL}/auth/me/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (res.status === 401) {
    // Attempt token refresh
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return fetchUserProfile(); // Retry
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) throw new Error("Failed to sync user profile.");

  const data = await res.json();
  
  if (data.access) {
    Cookies.set('cryptmorrow_access_token', data.access, { expires: 1, path: '/' });
  }

  return data.user;
};

/**
 * Attempts to refresh the access token using the refresh token.
 */
export const refreshAccessToken = async () => {
  const refreshToken = Cookies.get('cryptmorrow_refresh_token');
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });

    if (res.ok) {
      const data = await res.json();
      Cookies.set('cryptmorrow_access_token', data.access, { expires: 1, path: '/' });
      return data.access;
    }
  } catch (err) {
    console.error("Token refresh failed:", err);
  }
  return null;
};

/**
 * Fetches historical data from our Next.js Proxy API, which handles Binance data and indicators.
 */
export const fetchHistoricalData = async (coin, timeframe, limit = 100) => {
  const token = Cookies.get('cryptmorrow_access_token');

  // Map our timeframe to Binance expectation if needed
  // In the proxy, we handle these mappings or pass them through
  const symbol = `${coin}USDT`; // Binance symbols usually have USDT quote

  const res = await fetch(`/api/market/klines`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ symbol, limit, timeframe })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch market data.");
  }

  const data = await res.json();

  return {
    ...data,
    data: data.data.map(d => ({
      ...d,
      price: d.close,
      date: new Date(d.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'historical'
    }))
  };
};

/**
 * Creates a Stripe checkout session for membership/training.
 */
export const createCheckoutSession = async (membershipType, membershipName) => {
  const token = Cookies.get('cryptmorrow_access_token');
  const res = await fetch(`${API_URL}/payment/checkout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ membership_type: membershipType, membership_name: membershipName })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create checkout session.");
  }

  return await res.json(); // returns { url: "..." }
};

/**
 * Fetches trained models from the backend with optional filters.
 */
export const fetchTrainedModels = async (filters = {}) => {
  const token = Cookies.get('cryptmorrow_access_token');
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${API_URL}/get-trained-models/${queryParams ? `?${queryParams}` : ''}`;

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return fetchTrainedModels(filters);
    }
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch trained models.");
  }

  return await res.json();
};

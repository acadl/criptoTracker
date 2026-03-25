const BASE_URL = 'https://api.binance.com/api/v3';

export async function getOrderBook(symbol, limit = 10) {
  const res = await fetch(`${BASE_URL}/depth?symbol=${symbol}&limit=${limit}`);
  return res.json();
}

export async function getRecentTrades(symbol, limit = 20) {
  const res = await fetch(`${BASE_URL}/trades?symbol=${symbol}&limit=${limit}`);
  return res.json();
}
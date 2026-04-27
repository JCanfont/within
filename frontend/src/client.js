const API_URL = "http://127.0.0.1:8000";

export async function getStatus() {
  const res = await fetch(`${API_URL}/status`);
  return res.json();
}

export async function getStrategy() {
  const res = await fetch(`${API_URL}/strategy`);
  return res.json();
}

export async function getLevels() {
  const res = await fetch(`${API_URL}/levels`);
  return res.json();
}

export async function getForecast() {
  const res = await fetch(`${API_URL}/forecast`);
  return res.json();
}
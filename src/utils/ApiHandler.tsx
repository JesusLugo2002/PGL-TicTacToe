const API_BASE_URL = "http://127.0.0.1:5000";

async function getRequest(endpoint: string) {
  try {
    const response = await fetch(API_BASE_URL + endpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Something happend in get request, ", error);
  }
}

async function postRequest(endpoint: string, body: Record<string, any>) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  try {
    const response = await fetch(API_BASE_URL + endpoint, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Something happend in get request, ", error);
  }
}

export function registerPlayerDevice(playerName: string) {
  return postRequest("/devices", { "alias": playerName });
}

export function getOnlinePlayers() {
  return getRequest("/devices");
}

export function getPlayer(playerId: string) {
  return getRequest(`/devices/${playerId}/info`);
}
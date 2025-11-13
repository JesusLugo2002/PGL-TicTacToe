import { Match, MatchCallback, MatchStatus } from "@/interfaces/Match";
import { PlayerStats } from "@/interfaces/Player";

const API_BASE_URL = "http://127.0.0.1:5000";

/**
 * Ejecuta una peticion GET con el `endpoint` enviado como parametro.
 * @param endpoint Endpoint de la API a consumir.
 * @returns
 */
async function getRequest(endpoint: string): Promise<any> {
  try {
    const response = await fetch(API_BASE_URL + endpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Something happend while doing get request, ", error);
  }
}

/**
 * Ejecuta una peticion POST con el `endpoint` enviado como argumento y
 * el objeto `body` de la peticion.
 * @param endpoint Endpoint de la API a consumir.
 * @param body Objeto a pasar como `body` de la peticion.
 * @returns
 */
async function postRequest(endpoint: string, body: Record<string, any>): Promise<any> {
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
    console.error("Something happend while doing post request, ", error);
  }
}

/**
 * Registra un jugador como dispositivo conectado en la API.
 * @param playerName Nombre del jugador a registrar.
 * @returns UUID asignado al jugador.
 */
export function registerPlayerDevice(playerName: string): Promise<string> {
  return postRequest("/devices", { alias: playerName });
}

/**
 * Obtiene una lista de todos los jugadores conectados.
 * @returns Un `array` con las UUID de los jugadores conectados.
 */
export function getOnlinePlayers(): Promise<Array<string>> {
  return getRequest("/devices");
}

/**
 * Obtiene la informacion y estadisticas completas del jugador.
 * @param playerId UUID del jugador.
 * @returns Devuelve un objeto `PlayerStats` del jugador.
 */
export function getPlayer(playerId: string): Promise<PlayerStats> {
  return getRequest(`/devices/${playerId}/info`);
}

/**
 * Crea una partida si hay algun jugador en espera que cumpla las condiciones. De lo contrario,
 * deja al jugador en espera bajo las condiciones asignadas.
 * @param playerId UUID del jugador.
 * @param boardSize Tamaño del tablero.
 * @returns Si se ha creado la partida, un objeto `Match`, de lo contrario, un mensaje indicando que el jugador esta en espera.
 */
export function createMatch(playerId: string, boardSize: number): Promise<Match|Record<string, string>> {
  return postRequest("/matches", { device_id: playerId, size: boardSize });
}

/**
 * Devuelve el estado actual de la partida.
 * @param matchId UUID de la partida.
 * @returns Un objeto `MatchStatus` de la partida.
 */
export function getMatch(matchId: string): Promise<MatchStatus> {
  return getRequest(`/matches/${matchId}`);
}

/**
 * Realiza un movimiento en la partida.
 * @param matchId UUID de la partida.
 * @param playerId UUID del jugador que esta realizando el movimiento.
 * @param xPos Coordenada Y del cuadro en el tablero.
 * @param yPos Coordenada X del cuadro en el tablero.
 * @returns Un objeto `MatchCallback` que contiene el nuevo estado de la partida tras el movimiento.
 */
export function makeMove(
  matchId: string,
  playerId: string,
  xPos: number,
  yPos: number
): Promise<MatchCallback> {
  return postRequest(`/matches/${matchId}`, {
    device_id: playerId,
    x: xPos,
    y: yPos,
  });
}

from flask import Flask, request
from flask_restx import Resource, Api, fields
from uuid import uuid4
from datetime import timedelta
from time import time
import random

# ======== CONFIGURACIÓN ========
DISCONNECT_TIMEOUT = timedelta(minutes=5)

# ======== MODELOS EN MEMORIA ========
devices = {}  # {device_id: {"last_active": timestamp, "wins": 0, "losses": 0, "alias": str}}
matches = {}  # {match_id: {"players": {device_id: X/O}, "turn": device_id, "board": [[]], "size": int, "winner": symbol or None}}

# ======== APP Y API ========
app = Flask(__name__)
api = Api(
    app,
    title="TicTacToe API",
    version="1.0",
    description="API REST del juego de TicTacToe",
)


# ======== FUNCIONES AUXILIARES ========
def cleanup_inactive_devices():
    """Elimina dispositivos inactivos por más de DISCONNECT_TIMEOUT."""
    now = time()
    inactive = [
        d
        for d, info in devices.items()
        if now - info["last_active"] > DISCONNECT_TIMEOUT.total_seconds()
    ]
    for d in inactive:
        del devices[d]


def update_activity(device_id):
    """Actualiza la última actividad del dispositivo."""
    if device_id in devices:
        devices[device_id]["last_active"] = time()


def check_winner(board):
    """Verifica si hay ganador en el tablero (completa la línea)."""
    size = len(board)
    n_in_line = size  # para tableros de 3x3 a 7x7, se necesita completar toda la línea

    def check_line(cells):
        if len(set(cells)) == 1 and cells[0] in ["X", "O"]:
            return cells[0]
        return None

    # Filas y columnas
    for i in range(size):
        for j in range(size - n_in_line + 1):
            row_segment = board[i][j : j + n_in_line]
            winner = check_line(row_segment)
            if winner:
                return winner
            col_segment = [board[j + k][i] for k in range(n_in_line)]
            winner = check_line(col_segment)
            if winner:
                return winner

    # Diagonales
    for i in range(size - n_in_line + 1):
        for j in range(size - n_in_line + 1):
            diag1 = [board[i + k][j + k] for k in range(n_in_line)]
            diag2 = [board[i + k][j + n_in_line - 1 - k] for k in range(n_in_line)]
            for diag in [diag1, diag2]:
                winner = check_line(diag)
                if winner:
                    return winner

    return None


# ======== MODELOS DE DOCUMENTACIÓN ========
register_request = api.model(
    "RegisterRequest",
    {
        "alias": fields.String(
            required=False, description="Alias opcional del dispositivo"
        )
    },
)

register_response = api.model(
    "RegisterResponse",
    {"device_id": fields.String(description="ID único asignado al dispositivo")},
)

device_list_response = api.model(
    "DeviceListResponse",
    {
        "connected_devices": fields.List(
            fields.String, description="IDs de los dispositivos actualmente conectados"
        )
    },
)

match_create_response = api.model(
    "MatchCreateResponse",
    {
        "match_id": fields.String(description="ID de la partida creada"),
        "players": fields.Raw(description="Diccionario de jugadores y sus símbolos"),
        "board_size": fields.Integer(description="Tamaño del tablero"),
    },
)

move_request = api.model(
    "MoveRequest",
    {
        "device_id": fields.String(required=True, description="ID del dispositivo"),
        "x": fields.Integer(required=True, description="Coordenada X del movimiento"),
        "y": fields.Integer(required=True, description="Coordenada Y del movimiento"),
    },
)

move_response = api.model(
    "MoveResponse",
    {
        "board": fields.List(
            fields.List(fields.String), description="Estado actualizado del tablero"
        ),
        "next_turn": fields.String(description="ID del siguiente jugador"),
        "winner": fields.String(description="Símbolo del ganador (si existe)"),
    },
)

sync_response = api.model(
    "SyncResponse",
    {
        "board": fields.List(
            fields.List(fields.String), description="Estado actual del tablero"
        ),
        "turn": fields.String(description="ID del jugador cuyo turno es"),
        "winner": fields.String(description="Símbolo del ganador, si hay uno"),
        "size": fields.Integer(description="Tamaño del tablero"),
        "players": fields.Raw(description="Diccionario de jugadores y sus símbolos"),
    },
)

device_status_response = api.model(
    "DeviceStatusResponse",
    {
        "connected": fields.Boolean(
            description="Indica si el dispositivo está conectado"
        ),
        "wins": fields.Integer(description="Número de victorias"),
        "losses": fields.Integer(description="Número de derrotas"),
        "ratio": fields.Float(description="Ratio de victorias/(victorias+derrotas)"),
    },
)


# ======== ENDPOINTS ========
@api.route("/devices")
class Devices(Resource):
    @api.expect(register_request)
    @api.marshal_with(register_response, code=201)
    def post(self):
        """Registra un nuevo dispositivo."""
        device_id = str(uuid4())
        data = request.get_json(silent=True) or {}
        alias = data.get("alias", device_id[:8])
        devices[device_id] = {
            "last_active": time(),
            "wins": 0,
            "losses": 0,
            "alias": alias,
        }
        return {"device_id": device_id}, 201

    @api.marshal_with(device_list_response)
    def get(self):
        """Lista los dispositivos conectados."""
        cleanup_inactive_devices()
        return {"connected_devices": list(devices.keys())}


@api.route("/devices/<device_id>/info")
class Device(Resource):
    @api.marshal_with(device_status_response)
    def get(self, device_id):
        """Obtiene el estado de un dispositivo y sus estadísticas globales."""
        cleanup_inactive_devices()
        if device_id not in devices:
            api.abort(404, "Dispositivo no encontrado")

        device = devices[device_id]
        ratio = device["wins"] / max(1, device["wins"] + device["losses"])
        return {
            "connected": True,
            "wins": device["wins"],
            "losses": device["losses"],
            "ratio": ratio,
        }


@api.route("/matches")
class CreateMatch(Resource):
    @api.marshal_with(match_create_response, code=201)
    def post(self):
        """Crea una nueva partida entre dos jugadores conectados."""
        cleanup_inactive_devices()
        if len(devices) < 2:
            api.abort(400, "No hay suficientes dispositivos conectados")

        d1, d2 = random.sample(list(devices.keys()), 2)
        data = request.get_json(silent=True) or {}
        size = data.get("size", random.randint(3, 7))
        board = [["" for _ in range(size)] for _ in range(size)]
        match_id = str(uuid4())

        players = {d1: "X", d2: "O"}
        turn = next(pid for pid, sym in players.items() if sym == "X")

        matches[match_id] = {
            "players": players,
            "turn": turn,
            "board": board,
            "size": size,
            "winner": None,
        }

        return {"match_id": match_id, "players": players, "board_size": size}, 201


@api.route("/matches/<match_id>/moves")
class MatchMove(Resource):
    @api.expect(move_request)
    @api.marshal_with(move_response)
    def post(self, match_id):
        """Realiza un movimiento en la partida."""
        data = request.get_json()
        device_id, x, y = data["device_id"], data["x"], data["y"]

        if match_id not in matches:
            api.abort(404, "Partida no encontrada")

        match = matches[match_id]
        if match["winner"]:
            api.abort(400, "La partida ya ha terminado")
        if device_id != match["turn"]:
            api.abort(403, "No es tu turno")
        if not (0 <= x < match["size"] and 0 <= y < match["size"]):
            api.abort(400, "Movimiento fuera del tablero")
        if match["board"][x][y] != "":
            api.abort(400, "Casilla ocupada")

        symbol = match["players"][device_id]
        match["board"][x][y] = symbol

        winner = check_winner(match["board"])
        if winner:
            match["winner"] = winner
            for pid, sym in match["players"].items():
                if sym == winner:
                    devices[pid]["wins"] += 1
                else:
                    devices[pid]["losses"] += 1
            return {"board": match["board"], "next_turn": None, "winner": winner}

        next_turn = next(pid for pid in match["players"] if pid != device_id)
        match["turn"] = next_turn
        update_activity(device_id)

        return {"board": match["board"], "next_turn": next_turn, "winner": None}


@api.route("/matches/<match_id>")
class MatchState(Resource):
    @api.marshal_with(sync_response)
    def get(self, match_id):
        """Devuelve el estado actual de la partida."""
        if match_id not in matches:
            api.abort(404, "Partida no encontrada")
        m = matches[match_id]
        return {
            "board": m["board"],
            "turn": m["turn"],
            "winner": m["winner"],
            "size": m["size"],
            "players": m["players"],
        }


if __name__ == "__main__":
    app.run(debug=True)

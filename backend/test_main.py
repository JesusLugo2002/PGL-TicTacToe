import pytest
from main import api, devices, matches, waiting_players, DISCONNECT_TIMEOUT


@pytest.fixture
def client():
    api.app.config["TESTING"] = True
    with api.app.test_client() as client:
        yield client


# ===========================================================
#  TESTS DE DISPOSITIVOS
# ===========================================================


def test_register_device(client):
    devices.clear()
    matches.clear()

    res = client.post("/devices", json={"alias": "TestDev"})
    assert res.status_code == 201
    data = res.get_json()
    assert "device_id" in data
    device_id = data["device_id"]
    assert device_id in devices
    assert devices[device_id]["alias"] == "TestDev"


def test_unregister_device(client):
    devices.clear()
    matches.clear()

    res = client.post("/devices", json={"alias": "TestDev"})
    device_id = res.get_json()["device_id"]

    # Simulamos inactividad forzada
    devices[device_id]["last_active"] -= DISCONNECT_TIMEOUT.total_seconds()
    client.get("/devices")
    assert device_id not in devices


def test_list_devices(client):
    devices.clear()
    matches.clear()

    client.post("/devices", json={"alias": "TestDev"})
    res = client.get("/devices")
    assert res.status_code == 200
    data = res.get_json()
    assert "connected_devices" in data
    assert len(data["connected_devices"]) > 0


# ===========================================================
#  TESTS DE PARTIDA
# ===========================================================


def test_create_match(client):
    # Limpieza del estado global
    devices.clear()
    matches.clear()
    waiting_players.clear()

    # Registrar tres dispositivos
    d1 = client.post("/devices", json={"alias": "TestDev1"}).get_json()["device_id"]
    d2 = client.post("/devices", json={"alias": "TestDev2"}).get_json()["device_id"]
    d3 = client.post("/devices", json={"alias": "TestDev3"}).get_json()["device_id"]

    # A solicita tablero 5x5 → queda esperando
    res_a = client.post("/matches", json={"device_id": d1, "size": 5})
    assert res_a.status_code == 202
    assert res_a.get_json()["message"].startswith("Esperando oponente")
    assert len(waiting_players) == 1

    # B solicita tablero 3x3 → queda esperando, distinto tamaño
    res_b = client.post("/matches", json={"device_id": d2, "size": 3})
    assert res_b.status_code == 202
    assert len(waiting_players) == 2  # A y B esperando

    # C solicita tablero 5x5 → se empareja con A
    res_c = client.post("/matches", json={"device_id": d3, "size": 5})
    assert res_c.status_code == 201
    data_c = res_c.get_json()

    # Verificar estructura de la respuesta
    assert "match_id" in data_c
    match_id = data_c["match_id"]
    assert match_id in matches

    match = matches[match_id]
    assert match["size"] == 5
    assert len(match["board"]) == 5
    assert match["turn"] in match["players"]

    # Confirmar que se emparejó A (5x5) y C (5x5)
    players = match["players"]
    assert d1 in players and d3 in players
    assert d2 not in players  # B sigue esperando

    # Comprobar que queda solo B en la cola
    assert len(waiting_players) == 1
    assert waiting_players[0]["device_id"] == d2


# ===========================================================
#  TESTS DE MOVIMIENTOS Y VALIDACIONES
# ===========================================================


def test_make_move_and_turn_change(client):
    devices.clear()
    matches.clear()
    waiting_players.clear()

    d1 = client.post("/devices", json={"alias": "P1"}).get_json()["device_id"]
    d2 = client.post("/devices", json={"alias": "P2"}).get_json()["device_id"]

    # Crear partida
    client.post("/matches", json={"device_id": d1, "size": 3}).get_json()
    match_id = client.post("/matches", json={"device_id": d2, "size": 3}).get_json()[
        "match_id"
    ]

    match = matches[match_id]
    turn = match["turn"]

    # Primer movimiento
    res = client.post(
        f"/matches/{match_id}/moves", json={"device_id": turn, "x": 0, "y": 0}
    )
    assert res.status_code == 200
    data = res.get_json()
    assert "board" in data
    assert "next_turn" in data
    assert data["next_turn"] != turn


def test_invalid_turn(client):
    devices.clear()
    matches.clear()
    waiting_players.clear()

    d1 = client.post("/devices", json={"alias": "P1"}).get_json()["device_id"]
    d2 = client.post("/devices", json={"alias": "P2"}).get_json()["device_id"]

    client.post("/matches", json={"device_id": d1, "size": 3})
    match_id = client.post("/matches", json={"device_id": d2, "size": 3}).get_json()[
        "match_id"
    ]

    match = matches[match_id]
    wrong_player = [p for p in match["players"] if p != match["turn"]][0]

    res = client.post(
        f"/matches/{match_id}/moves", json={"device_id": wrong_player, "x": 0, "y": 0}
    )
    assert res.status_code == 403


def test_cell_occupied(client):
    devices.clear()
    matches.clear()
    waiting_players.clear()

    d1 = client.post("/devices", json={"alias": "P1"}).get_json()["device_id"]
    d2 = client.post("/devices", json={"alias": "P2"}).get_json()["device_id"]

    client.post("/matches", json={"device_id": d1, "size": 3})
    match_id = client.post("/matches", json={"device_id": d2, "size": 3}).get_json()[
        "match_id"
    ]

    match = matches[match_id]
    turn = match["turn"]

    # Primer movimiento válido
    client.post(f"/matches/{match_id}/moves", json={"device_id": turn, "x": 0, "y": 0})

    # Jugador contrario intenta la misma casilla
    other_player = [p for p in match["players"] if p != turn][0]
    res = client.post(
        f"/matches/{match_id}/moves", json={"device_id": other_player, "x": 0, "y": 0}
    )
    assert res.status_code == 400


# ===========================================================
#  TESTS DE SINCRONIZACIÓN
# ===========================================================


def test_sync_game(client):
    devices.clear()
    matches.clear()

    d1 = client.post("/devices").get_json()["device_id"]
    d2 = client.post("/devices").get_json()["device_id"]

    client.post("/matches", json={"device_id": d1, "size": 3})
    match_id = client.post("/matches", json={"device_id": d2, "size": 3}).get_json()[
        "match_id"
    ]

    res = client.get(f"/matches/{match_id}")
    assert res.status_code == 200
    data = res.get_json()

    assert set(data.keys()) == {"board", "turn", "winner", "size", "players"}
    assert set(data["players"].keys()) == {d1, d2}
    assert data["turn"] in [d1, d2]
    assert data["players"][d1] != data["players"][d2]


# ===========================================================
#  TESTS DE ESTADO DE DISPOSITIVO
# ===========================================================


def test_device_status_connected(client):
    devices.clear()
    d1 = client.post("/devices").get_json()["device_id"]
    res = client.get(f"/devices/{d1}/info")
    assert res.status_code == 200
    assert res.get_json()["connected"] is True


def test_device_status_disconnected(client):
    devices.clear()
    d1 = client.post("/devices").get_json()["device_id"]
    devices[d1]["last_active"] -= DISCONNECT_TIMEOUT.total_seconds()
    res = client.get(f"/devices/{d1}/info")
    assert res.status_code == 404


# ===========================================================
#  TESTS DE ESTADÍSTICAS
# ===========================================================


def test_device_stats_global(client):
    devices.clear()
    matches.clear()
    waiting_players.clear()

    # Registrar dos dispositivos
    r1 = client.post("/devices", json={"alias": "A"})
    r2 = client.post("/devices", json={"alias": "B"})
    d1 = r1.get_json()["device_id"]
    d2 = r2.get_json()["device_id"]

    # Crear partida
    match_res = client.post("/matches", json={"device_id": d1, "size": 3})
    match_res = client.post("/matches", json={"device_id": d2, "size": 3})

    match_data = match_res.get_json()
    match_id = match_data["match_id"]
    players = match_data["players"]
    device_x = next(pid for pid, sym in players.items() if sym == "X")
    device_o = next(pid for pid, sym in players.items() if sym == "O")

    # Secuencia de movimientos para que X gane
    moves = [
        (device_x, 0, 0),
        (device_o, 1, 0),
        (device_x, 0, 1),
        (device_o, 1, 1),
        (device_x, 0, 2),
    ]
    for device, x, y in moves:
        client.post(
            f"/matches/{match_id}/moves",
            json={"match_id": match_id, "device_id": device, "x": x, "y": y},
        )

    # Comprobar estadísticas globales del ganador
    stats = client.get(f"/devices/{device_x}/info").get_json()
    assert stats["wins"] == 1
    assert stats["losses"] == 0
    assert stats["ratio"] == 1.0

    # Comprobar estadísticas globales del perdedor
    stats = client.get(f"/devices/{device_o}/info").get_json()
    assert stats["wins"] == 0
    assert stats["losses"] == 1
    assert stats["ratio"] == 0.0


# ===========================================================
#  TEST FLOW COMPLETO DE PARTIDA 3x3
# ===========================================================


def test_full_game_flow_x_wins(client):
    devices.clear()
    matches.clear()
    waiting_players.clear()

    # Registrar dos dispositivos
    r1 = client.post("/devices", json={"alias": "Jugador1"})
    r2 = client.post("/devices", json={"alias": "Jugador2"})
    data1 = r1.get_json()
    data2 = r2.get_json()
    assert data1 and data2, "Error al registrar dispositivos"
    d1, d2 = data1["device_id"], data2["device_id"]

    # Crear partida (el jugador con símbolo X siempre empieza)
    match_res = client.post("/matches", json={"device_id": d1, "size": 3})
    assert match_res.status_code == 202, "El primer jugador debería quedar en espera"
    match_res = client.post("/matches", json={"device_id": d2, "size": 3})
    assert match_res.status_code == 201, "El segundo jugador debería iniciar la partida"

    match_data = match_res.get_json()
    match_id = match_data["match_id"]
    players = match_data["players"]

    assert d1 in players.keys() and d2 in players.keys(), (
        "Jugadores no asignados correctamente en la partida"
    )
    assert set(players.values()) == {"X", "O"}, (
        "Símbolos X y O no asignados correctamente"
    )
    assert matches[match_id]["turn"] in players.keys(), (
        "Turno inicial no asignado correctamente"
    )

    # Identificar jugadores X y O
    device_x = next(pid for pid, sym in players.items() if sym == "X")
    device_o = next(pid for pid, sym in players.items() if sym == "O")

    # Secuencia de movimientos para que gane X (fila superior)
    moves = [
        (device_x, 0, 0),
        (device_o, 1, 0),
        (device_x, 0, 1),
        (device_o, 1, 1),
        (device_x, 0, 2),
    ]

    for device, x, y in moves:
        res = client.post(
            f"/matches/{match_id}/moves",
            json={"match_id": match_id, "device_id": device, "x": x, "y": y},
        )
        assert res.status_code == 200, f"Movimiento inválido para {device}"

    # Comprobar que gana X
    final_data = matches[match_id]
    assert final_data["winner"] == "X"

    # Comprobar estadísticas globales de ambos jugadores
    stats_x = client.get(f"/devices/{device_x}/info").get_json()
    stats_o = client.get(f"/devices/{device_o}/info").get_json()
    assert stats_x["wins"] == 1 and stats_x["losses"] == 0, (
        "Estadísticas incorrectas para el jugador X"
    )
    assert stats_o["wins"] == 0 and stats_o["losses"] == 1, (
        "Estadísticas incorrectas para el jugador O"
    )


def test_full_game_flow_draw(client):
    devices.clear()
    matches.clear()
    waiting_players.clear()

    # Registrar dos dispositivos
    r1 = client.post("/devices", json={"alias": "Jugador1"})
    r2 = client.post("/devices", json={"alias": "Jugador2"})
    data1 = r1.get_json()
    data2 = r2.get_json()
    assert data1 and data2, "Error al registrar dispositivos"
    d1, d2 = data1["device_id"], data2["device_id"]

    # Crear partida (el jugador con símbolo X siempre empieza)
    match_res = client.post("/matches", json={"device_id": d1, "size": 3})
    assert match_res.status_code == 202, "El primer jugador debería quedar en espera"
    match_res = client.post("/matches", json={"device_id": d2, "size": 3})
    assert match_res.status_code == 201, "El segundo jugador debería iniciar la partida"

    match_data = match_res.get_json()
    match_id = match_data["match_id"]
    players = match_data["players"]

    assert d1 in players.keys() and d2 in players.keys(), (
        "Jugadores no asignados correctamente en la partida"
    )
    assert set(players.values()) == {"X", "O"}, (
        "Símbolos X y O no asignados correctamente"
    )
    assert matches[match_id]["turn"] in players.keys(), (
        "Turno inicial no asignado correctamente"
    )

    # Identificar jugadores X y O
    device_x = next(pid for pid, sym in players.items() if sym == "X")
    device_o = next(pid for pid, sym in players.items() if sym == "O")

    # Secuencia de movimientos para que haya un empate
    #  XOX
    #  XOO
    #  OXX
    moves = [
        (device_x, 0, 0),
        (device_o, 0, 1),
        (device_x, 0, 2),
        (device_o, 1, 1),
        (device_x, 1, 0),
        (device_o, 1, 2),
        (device_x, 2, 1),
        (device_o, 2, 0),
        (device_x, 2, 2),
    ]

    for device, x, y in moves:
        res = client.post(
            f"/matches/{match_id}/moves",
            json={"match_id": match_id, "device_id": device, "x": x, "y": y},
        )
        assert res.status_code == 200, f"Movimiento inválido para {device}"
    # Comprobar que hay un empate
    final_data = matches[match_id]
    assert final_data["winner"] == "Draw"

    # Get the final board state from the match
    match = client.get(f"/matches/{match_id}").get_json()
    board = match["board"]
    assert board == [
        ["X", "O", "X"],
        ["X", "O", "O"],
        ["O", "X", "X"],
    ], "El tablero final no coincide con el esperado para un empate."
    assert final_data["winner"] == "Draw", (
        "El resultado de la partida debería ser un empate."
    )

    # Comprobar estadísticas globales de ambos jugadores
    stats_x = client.get(f"/devices/{device_x}/info").get_json()
    stats_o = client.get(f"/devices/{device_o}/info").get_json()
    assert stats_x["wins"] == 0 and stats_x["losses"] == 0, (
        "Estadísticas incorrectas para el jugador X en caso de empate."
    )
    assert stats_o["wins"] == 0 and stats_o["losses"] == 0, (
        "Estadísticas incorrectas para el jugador O en caso de empate."
    )

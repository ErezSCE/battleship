import pytest
from fastapi.testclient import TestClient

from backend.api.app.main import app, _game_board, _current_turn
from backend.domain.game import Ship

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_state():
    # Reset the in‑memory board and turn before each test
    _game_board.ships.clear()
    global _current_turn
    _current_turn = 1
    yield
    # Cleanup after test if needed
    _game_board.ships.clear()
    _current_turn = 1

def test_fire_miss_when_no_ships():
    response = client.post("/fire", json={"x": 0, "y": 0})
    assert response.status_code == 200
    json = response.json()
    assert json["result"] == "miss"
    assert json["message"] == "Shot missed"

def test_fire_hit_when_ship_present():
    # Place a ship at (1,1) and (1,2)
    ship = Ship(type="Destroyer", size=2, coordinates=[(1, 1), (1, 2)])
    _game_board.ships.append(ship)
    response = client.post("/fire", json={"x": 1, "y": 2})
    assert response.status_code == 200
    json = response.json()
    assert json["result"] == "hit"
    assert json["message"] == "Shot hit a ship"

def test_fire_not_your_turn():
    # Simulate it's player 2's turn
    global _current_turn
    _current_turn = 2
    response = client.post("/fire", json={"x": 0, "y": 0})
    assert response.status_code == 400
    assert response.json()["detail"] == "Not your turn"

import pytest
from fastapi.testclient import TestClient

from backend.api.app.main import app, _boards
from backend.domain.game import Board, Ship

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_boards():
    """Ensure the in‑memory boards dict is cleared before each test."""
    _boards.clear()
    yield
    _boards.clear()

def test_get_board_success():
    player_id = "player1"
    ship = Ship(type="Destroyer", size=2, coordinates=[{"x": 0, "y": 0}, {"x": 0, "y": 1}])
    board = Board()
    board.place_ship(ship)
    _boards[player_id] = board

    response = client.get(f"/board/{player_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["width"] == board.width
    assert data["height"] == board.height
    assert isinstance(data["ships"], list)
    assert len(data["ships"]) == 1
    ship_data = data["ships"][0]
    assert ship_data["type"] == "Destroyer"
    assert ship_data["size"] == 2
    assert ship_data["coordinates"] == [{"x": 0, "y": 0}, {"x": 0, "y": 1}]

def test_get_board_not_found():
    response = client.get("/board/nonexistent")
    assert response.status_code == 404
    assert response.json()["detail"] == "Board not found"

def test_get_opponent_view_success():
    player_id = "player2"
    board = Board()
    _boards[player_id] = board

    response = client.get(f"/opponent_view/{player_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["width"] == board.width
    assert data["height"] == board.height
    assert data["hits"] == []
    assert data["misses"] == []

def test_get_opponent_view_not_found():
    response = client.get("/opponent_view/unknown")
    assert response.status_code == 404
    assert response.json()["detail"] == "Board not found"

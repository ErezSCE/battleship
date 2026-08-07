import pytest
from fastapi.testclient import TestClient

from backend.api.app.main import app, _game_board, _current_turn

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_state():
    # Ensure board is empty and turn is player 1
    _game_board.ships.clear()
    global _current_turn
    _current_turn = 1
    yield
    _game_board.ships.clear()
    _current_turn = 1

def test_fire_out_of_bounds():
    # Board default width/height is 10, so index 10 is out of bounds
    response = client.post("/fire", json={"x": 10, "y": 0})
    assert response.status_code == 400
    assert response.json()["detail"] == "Coordinates out of bounds"

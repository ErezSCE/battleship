"""FastAPI entry point for Game API Service

Provides endpoints to retrieve a player's board and the opponent view.
Boards are stored in-memory per player for the prototype.
"""

from fastapi import FastAPI, HTTPException
from typing import Dict

from backend.domain.game import Board, Ship

app = FastAPI(title="Game API Service")

# In-memory storage of player boards
_boards: Dict[str, Board] = {}

# Placeholder route
@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/board/{player_id}")
async def get_board(player_id: str):
    """Return the full board for the requesting player, including ship positions."""
    board = _boards.get(player_id)
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return {
        "width": board.width,
        "height": board.height,
        "ships": [
            {
                "type": ship.type,
                "size": ship.size,
                "coordinates": ship.coordinates,
            }
            for ship in board.ships
        ],
    }

@app.get("/opponent_view/{player_id}")
async def get_opponent_view(player_id: str):
    """Return a masked board for the opponent, showing only hit/miss markers.
    Ship positions are never exposed.
    """
    board = _boards.get(player_id)
    if board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    # Placeholder: no shot tracking implemented yet, return empty hits/misses
    return {
        "width": board.width,
        "height": board.height,
        "hits": [],
        "misses": [],
    }

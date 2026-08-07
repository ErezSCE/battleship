"""FastAPI entry point for Game API Service"""

from fastapi import FastAPI

app = FastAPI(title="Game API Service")

# Placeholder route
@app.get("/health")
async def health_check():
    return {"status": "ok"}

from fastapi import HTTPException
from pydantic import BaseModel, Field
from backend.domain.game import Board, Ship

# In‑memory game state (simplified)
_game_board = Board()
_current_turn = 1  # Player 1's turn

class FireShotRequest(BaseModel):
    x: int = Field(..., ge=0, description="X coordinate (0‑based)")
    y: int = Field(..., ge=0, description="Y coordinate (0‑based)")

class FireShotResponse(BaseModel):
    result: str = Field(..., description="Result of the shot: 'hit' or 'miss'")
    message: str = Field(..., description="Human readable result message")

@app.post("/fire", response_model=FireShotResponse)
async def fire_shot(request: FireShotRequest):
    global _current_turn
    # Enforce turn order: only player 1 can fire via this endpoint
    if _current_turn != 1:
        raise HTTPException(status_code=400, detail="Not your turn")
    # Determine hit or miss
    hit = any((request.x, request.y) in ship.coordinates for ship in _game_board.ships)
    result = "hit" if hit else "miss"
    message = "Shot hit a ship" if hit else "Shot missed"
    # Toggle turn (simplified)
    _current_turn = 2 if _current_turn == 1 else 1
    return FireShotResponse(result=result, message=message)

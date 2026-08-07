"""FastAPI application for Battleship ship placement.

Provides a single endpoint POST /place_ship that accepts a JSON payload
with the ship's coordinates and validates basic placement rules:
- Coordinates must be within the board bounds (0-9 for both x and y).
- All coordinates must be aligned either horizontally or vertically.
- No duplicate coordinates.
- At least two coordinates are required (a ship must occupy >0 cells).
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, conlist, validator
from typing import List

app = FastAPI()

BOARD_SIZE = 10  # 10x10 board (indices 0-9)

class Coordinate(BaseModel):
    x: int
    y: int

    @validator('x', 'y')
    def within_bounds(cls, v: int) -> int:
        if not (0 <= v < BOARD_SIZE):
            raise ValueError('coordinate out of bounds')
        return v

class PlaceShipRequest(BaseModel):
    coordinates: conlist(Coordinate, min_items=2)

    @validator('coordinates')
    def validate_alignment(cls, coords: List[Coordinate]):
        # Ensure all x are the same (vertical) or all y are the same (horizontal)
        xs = {c.x for c in coords}
        ys = {c.y for c in coords}
        if len(xs) != 1 and len(ys) != 1:
            raise ValueError('coordinates must be aligned horizontally or vertically')
        # No duplicate cells
        seen = set()
        for c in coords:
            key = (c.x, c.y)
            if key in seen:
                raise ValueError('duplicate coordinate')
            seen.add(key)
        return coords

@app.post('/place_ship')
async def place_ship(request: PlaceShipRequest):
    # In a real implementation, we would update game state here.
    # For this assignment we simply return the validated coordinates.
    return {'status': 'ok', 'placed': [c.dict() for c in request.coordinates]}

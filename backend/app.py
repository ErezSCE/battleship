"""FastAPI-like application for Battleship ship placement.

Provides a single endpoint POST /place_ship that accepts a JSON payload
with the ship's coordinates and validates basic placement rules:
- Coordinates must be within the board bounds (0-9 for both x and y).
- All coordinates must be aligned either horizontally or vertically.
- No duplicate coordinates.
- At least two coordinates are required.
"""

from fastapi import FastAPI, HTTPException
from typing import List, Dict
from pydantic import BaseModel

app = FastAPI()

BOARD_SIZE = 10  # 10x10 board (indices 0-9)

def _validate_coordinates(coords: List[Dict[str, int]]) -> List[Dict[str, int]]:
    if len(coords) < 2:
        raise ValueError('at least two coordinates required')
    xs = {c['x'] for c in coords}
    ys = {c['y'] for c in coords}
    if len(xs) != 1 and len(ys) != 1:
        raise ValueError('coordinates must be aligned horizontally or vertically')
    seen = set()
    for c in coords:
        x, y = c['x'], c['y']
        if not (0 <= x < BOARD_SIZE) or not (0 <= y < BOARD_SIZE):
            raise ValueError('coordinate out of bounds')
        key = (x, y)
        if key in seen:
            raise ValueError('duplicate coordinate')
        seen.add(key)
    return coords

class PlaceShipRequest(BaseModel):
    coordinates: List[Dict[str, int]]

@app.post('/place_ship')
def place_ship(payload: Dict):
    try:
        # Validate and parse payload using Pydantic model
        request = PlaceShipRequest(**payload)
        coords = request.coordinates
        validated = _validate_coordinates(coords)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        # Handles Pydantic validation errors or other issues
        raise HTTPException(status_code=422, detail=str(e))
    return {'status': 'ok', 'placed': validated}

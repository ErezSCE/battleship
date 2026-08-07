import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_place_ship_success():
    payload = {
        "coordinates": [
            {"x": 0, "y": 0},
            {"x": 1, "y": 0},
            {"x": 2, "y": 0}
        ]
    }
    response = client.post('/place_ship', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'ok'
    assert data['placed'] == payload['coordinates']

def test_place_ship_invalid_not_aligned():
    payload = {
        "coordinates": [
            {"x": 0, "y": 0},
            {"x": 1, "y": 1}
        ]
    }
    response = client.post('/place_ship', json=payload)
    assert response.status_code == 422

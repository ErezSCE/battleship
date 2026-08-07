import pytest
from backend.app import app, _validate_coordinates

def test_validate_coordinates_success():
    coords = [{'x': 0, 'y': 0}, {'x': 1, 'y': 0}, {'x': 2, 'y': 0}]
    assert _validate_coordinates(coords) == coords

def test_validate_coordinates_not_aligned():
    coords = [{'x': 0, 'y': 0}, {'x': 1, 'y': 1}]
    with pytest.raises(ValueError, match='aligned'):
        _validate_coordinates(coords)

def test_place_ship_endpoint_success():
    payload = {'coordinates': [{'x': 0, 'y': 0}, {'x': 1, 'y': 0}]}
    response = app.post('/place_ship')(payload)  # directly invoke handler
    assert response['status'] == 'ok'
    assert response['placed'] == payload['coordinates']

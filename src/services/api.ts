import axios from 'axios';

// Axios instance is globally configured in main.ts (axios.defaults.baseURL).
// These helper functions wrap the Game API endpoints.

export interface Coordinate {
  x: number;
  y: number;
}

export interface ShipPlacementPayload {
  coordinates: Coordinate[];
}

export interface FirePayload {
  x: number;
  y: number;
}

export async function placeShip(gameId: string, payload: ShipPlacementPayload) {
  const response = await axios.post(`/games/${gameId}/ships`, payload);
  return response.data;
}

export async function fireShot(gameId: string, payload: FirePayload) {
  const response = await axios.post(`/games/${gameId}/shots`, payload);
  return response.data;
}

export async function getBoard(gameId: string, playerId: string) {
  const response = await axios.get(`/games/${gameId}/boards/${playerId}`);
  return response.data;
}

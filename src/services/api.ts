import axios from 'axios';

// Create a dedicated Axios instance for the Game API.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

// Export the instance for potential external use.
export { api };

// These helper functions wrap the Game API endpoints using the dedicated instance.

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
  try {
    const response = await api.post(`/games/${gameId}/ships`, payload);
    return response.data;
  } catch (error) {
    // Preserve original error details for UI diagnostics
    throw error;
  }
}

export async function fireShot(payload: FirePayload, playerId: number = 1) {
  try {
    const response = await api.post(`/fire`, { ...payload, player_id: playerId });
    return response.data;
  } catch (error) {
    // Preserve original error details for better diagnostics
    throw error;
  }
}

export async function getBoard(gameId: string, playerId: string) {
  try {
    const response = await api.get(`/games/${gameId}/boards/${playerId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get board: ${(error as Error).message}`);
  }
}

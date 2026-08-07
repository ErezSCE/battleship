// src/api/client.ts
// Typed Axios client for Battleship game API

import axios, { AxiosInstance } from 'axios';

export interface Coordinate {
  x: number;
  y: number;
}

export interface ShipPlacementRequest {
  coordinates: Coordinate[];
}

export interface ShotRequest {
  x: number;
  y: number;
}

export interface BoardCell {
  x: number;
  y: number;
  hasShip: boolean;
  hit?: boolean;
}

export interface BoardResponse {
  cells: BoardCell[];
}

export interface ShipInfo {
  type: string;
  size: number;
  coordinates: Coordinate[];
}

// Alias types for backward compatibility
export type BoardInfoResponse = BoardResponse;
export type OpponentViewResponse = BoardResponse;

export class ApiClient {
  private http: AxiosInstance;

  constructor(baseURL: string = '') {
    this.http = axios.create({ baseURL });
  }

  async placeShip(gameId: string, payload: ShipPlacementRequest): Promise<BoardResponse> {
    const response = await this.http.post<BoardResponse>(`/games/${gameId}/ships`, payload);
    return response.data;
  }

  async fireShot(gameId: string, payload: ShotRequest): Promise<BoardResponse> {
    const response = await this.http.post<BoardInfoResponse>(`/games/${gameId}/shots`, payload);
    return response.data;
  }

  async getBoard(gameId: string): Promise<BoardInfoResponse> {
    const response = await this.http.get<BoardInfoResponse>(`/games/${gameId}/board`);
    return response.data;
  }

  async getOpponentView(gameId: string): Promise<OpponentViewResponse> {
    const response = await this.http.get<OpponentViewResponse>(`/games/${gameId}/opponent-board`);
    return response.data;
  }

}

export const apiClient = new ApiClient();

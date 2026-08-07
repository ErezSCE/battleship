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

class ApiClient {
  private http: AxiosInstance;

  constructor(baseURL: string = '') {
    this.http = axios.create({ baseURL });
  }

  async placeShip(gameId: string, payload: ShipPlacementRequest): Promise<BoardResponse> {
    const response = await this.http.post<BoardResponse>(`/games/${gameId}/ships`, payload);
    return response.data;
  }

  async fireShot(gameId: string, payload: ShotRequest): Promise<BoardResponse> {
    const response = await this.http.post<BoardResponse>(`/games/${gameId}/shots`, payload);
    return response.data;
  }

  async getBoard(gameId: string): Promise<BoardResponse> {
    const response = await this.http.get<BoardResponse>(`/games/${gameId}/board`);
    return response.data;
  }

  async getOpponentView(gameId: string): Promise<BoardResponse> {
    const response = await this.http.get<BoardResponse>(`/games/${gameId}/opponent-board`);
    return response.data;
  }
}

export const apiClient = new ApiClient();

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

export interface BoardInfoResponse {
  width: number;
  height: number;
  ships: ShipInfo[];
}

export interface ShipInfo {
  type: string;
  size: number;
  coordinates: Coordinate[];
}

export interface OpponentViewResponse {
  width: number;
  height: number;
  hits: Coordinate[];
  misses: Coordinate[];
}

class ApiClient {
  private http: AxiosInstance;

  constructor(baseURL: string = '') {
    this.http = axios.create({ baseURL });
  }

  async placeShip(gameId: string, payload: ShipPlacementRequest): Promise<BoardInfoResponse> {
    const response = await this.http.post<BoardInfoResponse>(`/games/${gameId}/ships`, payload);
    return response.data;
  }

  async fireShot(gameId: string, payload: ShotRequest): Promise<BoardInfoResponse> {
    const response = await this.http.post<BoardInfoResponse>(`/games/${gameId}/shots`, payload);
    return response.data;
  }

  async getBoard(gameId: string): Promise<BoardInfoResponse> {
    const response = await this.http.get<BoardResponse>(`/games/${gameId}/board`);
    return response.data;
  }

  async getOpponentView(gameId: string): Promise<OpponentViewResponse> {
    const response = await this.http.get<BoardResponse>(`/games/${gameId}/opponent-board`);
    return response.data;
  }
}

export const apiClient = new ApiClient();

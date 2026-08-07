// src/store/gameStore.ts
// Pinia store managing Battleship game state and actions

import { defineStore } from 'pinia';
import { apiClient, Coordinate, BoardResponse, BoardCell, BoardInfoResponse, OpponentViewResponse } from '../api/client';

export const useGameStore = defineStore('game', {
  state: () => ({
    gameId: '' as string,
    board: [] as BoardCell[],
    opponentBoard: [] as BoardCell[],
    currentTurn: '' as string, // player id
    winner: '' as string,
    status: 'idle' as 'idle' | 'loading' | 'error' | 'finished',
  }),
  actions: {
    async initGame(gameId: string) {
      this.gameId = gameId;
      await this.fetchBoard();
    },
    async fetchBoard() {
      if (!this.gameId) return;
      this.status = 'loading';
      try {
        const boardRes: BoardInfoResponse = await apiClient.getBoard(this.gameId);
        const oppRes: OpponentViewResponse = await apiClient.getOpponentView(this.gameId);
        // Transform board info into cells array
        this.board = this.transformBoardInfo(boardRes);
        this.opponentBoard = this.transformOpponentView(oppRes);
        this.status = 'idle';
      } catch (e) {
        this.status = 'error';
        console.error('Failed to fetch board', e);
      }
    },
    async placeShip(coordinates: Coordinate[]) {
      if (!this.gameId) return;
      this.status = 'loading';
      try {
        const res = await apiClient.placeShip(this.gameId, { coordinates });
        this.board = this.transformBoardInfo(res);
        this.status = 'idle';
      } catch (e) {
        this.status = 'error';
        console.error('Failed to place ship', e);
      }
    },
    async fireShot(x: number, y: number) {
      if (!this.gameId) return;
      this.status = 'loading';
      try {
        const res = await apiClient.fireShot(this.gameId, { x, y });
        this.opponentBoard = this.transformOpponentViewFromBoardInfo(res);
        this.status = 'idle';
      } catch (e) {
        this.status = 'error';
        console.error('Failed to fire shot', e);
      }
    },
    resetGame() {
      this.gameId = '';
      this.board = [];
      this.opponentBoard = [];
      this.currentTurn = '';
      this.winner = '';
      this.status = 'idle';
    },
    // Helper to convert BoardInfoResponse to BoardCell array
    transformBoardInfo(info: BoardInfoResponse): BoardCell[] {
      const cells: BoardCell[] = [];
      info.ships.forEach((ship) => {
        ship.coordinates.forEach((coord) => {
          cells.push({ x: coord.x, y: coord.y, hasShip: true });
        });
      });
      return cells;
    },
    // Helper to convert OpponentViewResponse to BoardCell array
    transformOpponentView(view: OpponentViewResponse): BoardCell[] {
      const cells: BoardCell[] = [];
      view.hits.forEach((coord) => {
        cells.push({ x: coord.x, y: coord.y, hasShip: false, hit: true });
      });
      view.misses.forEach((coord) => {
        cells.push({ x: coord.x, y: coord.y, hasShip: false, hit: false });
      });
      return cells;
    },
    // For fireShot response (BoardInfoResponse) we treat similarly to opponent view for now
    transformOpponentViewFromBoardInfo(info: BoardInfoResponse): BoardCell[] {
      // Reuse transformBoardInfo as placeholder
      return this.transformBoardInfo(info);
    },
  },
});

// src/store/gameStore.ts
// Pinia store managing Battleship game state and actions

import { defineStore } from 'pinia';
import { apiClient, Coordinate, BoardResponse } from '../api/client';

export interface BoardCell {
  x: number;
  y: number;
  hasShip: boolean;
  hit?: boolean;
}

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
        const boardRes: BoardResponse = await apiClient.getBoard(this.gameId);
        const oppRes: BoardResponse = await apiClient.getOpponentView(this.gameId);
        this.board = boardRes.cells;
        this.opponentBoard = oppRes.cells;
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
        this.board = res.cells;
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
        this.opponentBoard = res.cells;
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
  },
});

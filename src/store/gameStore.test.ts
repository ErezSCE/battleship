import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from './gameStore';
import * as api from '../api/client';

vi.mock('../api/client');
const mockedApi = vi.mocked(api);

beforeEach(() => {
  vi.resetAllMocks();
  setActivePinia(createPinia());
});

describe('gameStore', () => {
  it('initGame sets gameId and fetches board', async () => {
    const boardRes = { cells: [{ x: 0, y: 0, hasShip: false }] } as api.BoardResponse;
    const oppRes = { cells: [] } as api.BoardResponse;
    mockedApi.apiClient.getBoard.mockResolvedValue(boardRes);
    mockedApi.apiClient.getOpponentView.mockResolvedValue(oppRes);
    const store = useGameStore();
    await store.initGame('game123');
    expect(store.gameId).toBe('game123');
    expect(store.board).toEqual(boardRes.cells);
    expect(store.opponentBoard).toEqual(oppRes.cells);
    expect(mockedApi.apiClient.getBoard).toHaveBeenCalledWith('game123');
    expect(mockedApi.apiClient.getOpponentView).toHaveBeenCalledWith('game123');
  });

  it('placeShip updates board on success', async () => {
    const res = { cells: [{ x: 0, y: 0, hasShip: true }] } as api.BoardResponse;
    mockedApi.apiClient.placeShip.mockResolvedValue(res);
    const store = useGameStore();
    store.gameId = 'game123';
    await store.placeShip([{ x: 0, y: 0 }]);
    expect(store.board).toEqual(res.cells);
    expect(mockedApi.apiClient.placeShip).toHaveBeenCalledWith('game123', { coordinates: [{ x: 0, y: 0 }] });
  });

  it('resetGame clears state', () => {
    const store = useGameStore();
    store.gameId = 'g';
    store.board = [{ x: 1, y: 1, hasShip: false }];
    store.resetGame();
    expect(store.gameId).toBe('');
    expect(store.board).toEqual([]);
  });
});

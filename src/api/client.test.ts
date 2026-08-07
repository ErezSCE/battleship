import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);
// Provide a default mock axios instance before importing apiClient
mockedAxios.create.mockReturnValue({
  post: vi.fn(),
  get: vi.fn(),
} as any);
import { apiClient, Coordinate, BoardInfoResponse, OpponentViewResponse } from './client';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('apiClient', () => {
  it('placeShip sends POST to correct URL and returns board data', async () => {
    const mockResponse = { data: { cells: [{ x: 0, y: 0, hasShip: true }] } } as any;
    mockedAxios.create.mockReturnValue({
      post: vi.fn().mockResolvedValue(mockResponse),
    } as any);
    const coords: Coordinate[] = [{ x: 0, y: 0 }, { x: 0, y: 1 }];
    const result = await apiClient.placeShip('game123', { coordinates: coords });
    expect(result).toEqual(mockResponse.data);
    // ensure correct endpoint used
    const postMock = mockedAxios.create().post as any;
    expect(postMock).toHaveBeenCalledWith('/games/game123/ships', { coordinates: coords });
  });

  it('fireShot sends POST and returns board data', async () => {
    const mockResponse = { data: { cells: [] } } as any;
    mockedAxios.create.mockReturnValue({
      post: vi.fn().mockResolvedValue(mockResponse),
    } as any);
    const result = await apiClient.fireShot('game456', { x: 3, y: 4 });
    expect(result).toEqual(mockResponse.data);
    const postMock = mockedAxios.create().post as any;
    expect(postMock).toHaveBeenCalledWith('/games/game456/shots', { x: 3, y: 4 });
  });

  it('getBoard sends GET and returns board data', async () => {
    const mockResponse = { data: { cells: [] } } as any;
    mockedAxios.create.mockReturnValue({
      get: vi.fn().mockResolvedValue(mockResponse),
    } as any);
    const result = await apiClient.getBoard('game789');
    expect(result).toEqual(mockResponse.data);
    const getMock = mockedAxios.create().get as any;
    expect(getMock).toHaveBeenCalledWith('/games/game789/board');
  });
});

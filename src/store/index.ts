import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGameStore = defineStore('game', () => {
  // State: ships placed, hits, winner
  const ships = ref<Array<{ coordinates: { x: number; y: number }[] }>>([]);
  const hits = ref<Array<{ x: number; y: number; result: string }>>([]);
  const winner = ref<string | null>(null);

  function addShip(ship: { coordinates: { x: number; y: number }[] }) {
    ships.value.push(ship);
  }

  function recordHit(hit: { x: number; y: number; result: string }) {
    hits.value.push(hit);
    // Improved win detection: set winner only when a hit indicates win and all ships have been hit.
    if (hit.result === 'win') {
      // Simple heuristic: if number of hits equals total ship cells (assuming each ship has size 1 for demo).
      // In a real implementation, we'd track ship health.
      const totalShipCells = ships.value.reduce((sum, ship) => sum + ship.coordinates.length, 0);
      if (hits.value.filter(h => h.result === 'hit' || h.result === 'win').length >= totalShipCells) {
        winner.value = 'You';
      }
    }
  }

  function reset() {
    ships.value = [];
    hits.value = [];
    winner.value = null;
  }

  // Expose Pinia's built‑in reset pattern via $reset property.
  return { ships, hits, winner, addShip, recordHit, $reset: reset };
});

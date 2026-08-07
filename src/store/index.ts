import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGameStore = defineStore('game', () => {
  // Example state: ships placed, hits, winner
  const ships = ref<Array<{ coordinates: { x: number; y: number }[] }>>([]);
  const hits = ref<Array<{ x: number; y: number; result: string }>>([]);
  const winner = ref<string | null>(null);

  function addShip(ship: { coordinates: { x: number; y: number }[] }) {
    ships.value.push(ship);
  }

  function recordHit(hit: { x: number; y: number; result: string }) {
    hits.value.push(hit);
    // Simplified win detection
    if (hit.result === 'win') {
      winner.value = 'You';
    }
  }

  function reset() {
    ships.value = [];
    hits.value = [];
    winner.value = null;
  }

  return { ships, hits, winner, addShip, recordHit, $reset: reset };
});

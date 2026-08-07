<template>
  <div class="game-container">
    <PlayerBoard :size="10" @place-ship="onPlaceShip" />
    <OpponentBoard :size="10" @fire="onFire" />
    <VictoryModal v-if="winner" :winner="winner" @restart="onRestart" />
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import PlayerBoard from '../components/PlayerBoard.vue';
import OpponentBoard from '../components/OpponentBoard.vue';
import VictoryModal from '../components/VictoryModal.vue';
import { useGameStore } from '../store';
import { fireShot } from '../services/api';

const store = useGameStore();
const winner = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

function onPlaceShip(payload: { coordinates: { x: number; y: number }[] }) {
  store.addShip({ coordinates: payload.coordinates });
}

async function onFire(payload: { x: number; y: number }) {
  try {
    // Assuming a single game context; using a placeholder gameId.
    const gameId = 'demo-game';
    const response = await fireShot(gameId, { x: payload.x, y: payload.y });
    // Expect response to contain a `result` field.
    // Validate response format
    if (!response || typeof response.result !== 'string') {
      throw new Error('Invalid response format from fireShot');
    }
    const result = response.result;
    store.recordHit({ x: payload.x, y: payload.y, result });
    // Clear any previous error message on success
    errorMessage.value = null;
  } catch (e) {
    // Improved error handling: capture message for UI display
    const msg = e instanceof Error ? e.message : String(e);
    errorMessage.value = msg;
    console.error('Failed to fire shot:', e);
  }
}

function onRestart() {
  store.$reset();
  winner.value = null;
}

watch(
  () => store.winner,
  (newWinner) => {
    winner.value = newWinner;
  }
);
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>

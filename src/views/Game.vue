<template>
  <div class="game-container">
    <PlayerBoard :size="10" @place-ship="onPlaceShip" />
    <OpponentBoard :size="10" @fire="onFire" />
    <VictoryModal v-if="winner" :winner="winner" @restart="onRestart" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import PlayerBoard from '../components/PlayerBoard.vue';
import OpponentBoard from '../components/OpponentBoard.vue';
import VictoryModal from '../components/VictoryModal.vue';
import { useGameStore } from '../store';

const store = useGameStore();
const winner = ref<string | null>(null);

function onPlaceShip(payload: { coordinates: { x: number; y: number }[] }) {
  store.addShip({ coordinates: payload.coordinates });
}

function onFire(payload: { x: number; y: number }) {
  // Placeholder: simulate a hit result
  const result = Math.random() > 0.5 ? 'hit' : 'miss';
  store.recordHit({ x: payload.x, y: payload.y, result });
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

<template>
  <div id="app">
    <!-- Main game layout -->
    <PlayerBoard :size="10" @place-ship="onPlaceShip" />
    <OpponentBoard :size="10" @fire="onFire" />
    <VictoryModal v-if="winner" :winner="winner" @restart="onRestart" />
    <!-- Router view for potential future routes -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PlayerBoard from './components/PlayerBoard.vue';
import OpponentBoard from './components/OpponentBoard.vue';
import VictoryModal from './components/VictoryModal.vue';
import { useGameStore } from './store';

const store = useGameStore();
const winner = ref<string | null>(null);

function onPlaceShip(payload: { coordinates: { x: number; y: number }[] }) {
  console.log('Ship placed:', payload.coordinates);
  // Example: could commit to store
}

function onFire(payload: { x: number; y: number }) {
  console.log('Fire at:', payload);
  // Example: could call API and update store
}

function onRestart() {
  // Reset store and local state
  store.$reset();
  winner.value = null;
}

// Watch store for winner (simplified example)
if (store.winner) {
  winner.value = store.winner;
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}
</style>

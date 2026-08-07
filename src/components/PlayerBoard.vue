<template>
  <div class="player-board">
    <div class="grid">
      <div
        v-for="cell in cells"
        :key="cell.id"
        class="cell"
        :class="{ ship: cell.hasShip }"
        :data-cell="cell.id"
        @click="onCellClick(cell)"
      >
        {{ cell.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';

interface Cell {
  id: string;
  x: number;
  y: number;
  hasShip: boolean;
  label: string;
}

const props = defineProps<{ size: number }>(); // board size (e.g., 10)
const emit = defineEmits<{
  (e: 'place-ship', payload: { coordinates: { x: number; y: number }[] }): void;
}>();

const cells = computed(() => {
  const arr: Cell[] = [];
  for (let y = 0; y < props.size; y++) {
    for (let x = 0; x < props.size; x++) {
      arr.push({
        id: `${x}-${y}`,
        x,
        y,
        hasShip: false,
        label: `${x},${y}`,
      });
    }
  }
  return arr;
});

// Simple ship placement logic: click two cells to define a ship (start & end)
const selected: Cell[] = [];

function onCellClick(cell: Cell) {
  if (selected.length < 2) {
    selected.push(cell);
    if (selected.length === 2) {
      const [start, end] = selected;
      const coordinates = generateCoordinates(start, end);
      emit('place-ship', { coordinates });
      // reset selection
      selected.splice(0, selected.length);
    }
  }
}

function generateCoordinates(start: Cell, end: Cell) {
  const coords: { x: number; y: number }[] = [];
  if (start.x === end.x) {
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);
    for (let y = minY; y <= maxY; y++) {
      coords.push({ x: start.x, y });
    }
  } else if (start.y === end.y) {
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    for (let x = minX; x <= maxX; x++) {
      coords.push({ x, y: start.y });
    }
  } else {
    // diagonal not allowed, treat as single cell
    coords.push({ x: start.x, y: start.y });
  }
  return coords;
}
</script>

<style scoped>
.player-board {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.grid {
  display: grid;
  grid-template-columns: repeat(var(--size), 30px);
  gap: 2px;
}
.cell {
  width: 30px;
  height: 30px;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
}
.cell.ship {
  background: #4caf50;
}
</style>

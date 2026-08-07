<template>
  <div class="opponent-board">
    <div class="grid" :style="{'--size': size}">
      <div
        v-for="cell in cells"
        :key="cell.id"
        class="cell"
        :data-cell="cell.id"
        @click="onCellClick(cell)"
      >
        {{ cell.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

interface Cell {
  id: string;
  x: number;
  y: number;
  label: string;
}

const props = defineProps<{ size: number }>();
const emit = defineEmits<{
  (e: 'fire', payload: { x: number; y: number }): void;
}>();

// Generate a flat list of cells for the board
const cells = computed(() => {
  const arr: Cell[] = [];
  for (let y = 0; y < props.size; y++) {
    for (let x = 0; x < props.size; x++) {
      arr.push({
        id: `${x}-${y}`,
        x,
        y,
        label: `${x},${y}`,
      });
    }
  }
  return arr;
});

function onCellClick(cell: Cell) {
  emit('fire', { x: cell.x, y: cell.y });
}
</script>

<style scoped>
.opponent-board {
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
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
}
</style>

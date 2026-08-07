<template>
  <div class="victory-modal" role="dialog" aria-modal="true">
    <div class="victory-modal__content">
      <h2 class="victory-modal__title">Game Over</h2>
      <p class="victory-modal__winner">Winner: {{ winner }}</p>
      <button class="victory-modal__restart" @click="onRestart" data-test="restart-button">
        Restart Game
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{ winner: string }>();
const emit = defineEmits<{
  (e: 'restart'): void;
}>();

function onRestart() {
  emit('restart');
}
</script>

<style scoped>
.victory-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.victory-modal__content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  min-width: 300px;
}

.victory-modal__title {
  margin: 0 0 1rem;
  font-size: 1.5rem;
}

.victory-modal__winner {
  margin: 0 0 1.5rem;
  font-weight: bold;
}

.victory-modal__restart {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  background: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
}
</style>

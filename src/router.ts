import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import GameView from './views/Game.vue';
import VictoryModal from './components/VictoryModal.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Game',
    component: GameView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

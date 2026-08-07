import { expect, test } from 'vitest';
import router from './router';
import GameView from './views/Game.vue';

test('router has a route for the game view', () => {
  const route = router.getRoutes().find(r => r.name === 'Game');
  expect(route).toBeDefined();
  expect(route?.component).toBe(GameView);
});

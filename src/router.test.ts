import { expect, test } from 'vitest';
import router from './router';
test('router has a route for the game view', () => {
  const route = router.getRoutes().find(r => r.name === 'Game');
  expect(route).toBeDefined();
  // Verify basic route properties.
  expect(route?.path).toBe('/');
});

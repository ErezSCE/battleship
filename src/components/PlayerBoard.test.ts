import { mount } from '@vue/test-utils';
import PlayerBoard from './PlayerBoard.vue';

describe('PlayerBoard.vue', () => {
  it('emits place-ship with correct coordinates for horizontal placement', async () => {
    const wrapper = mount(PlayerBoard, {
      props: { size: 5 },
    });
    // Find cells at (0,0) and (2,0) for a horizontal ship of length 3
    const cell00 = wrapper.find('[data-cell="0-0"]');
    const cell20 = wrapper.find('[data-cell="2-0"]');
    // If data attributes not present, fallback to text content
    // Click first cell
    await cell00.trigger('click');
    // Click second cell
    await cell20.trigger('click');

    // Expect emit
    const emitted = wrapper.emitted('place-ship');
    expect(emitted).toBeTruthy();
    const payload = emitted![0][0];
    expect(payload.coordinates).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ]);
  });
});

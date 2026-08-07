import { mount } from '@vue/test-utils';
import PlayerBoard from './PlayerBoard.vue';

describe('PlayerBoard.vue additional behavior', () => {
  it('emits invalid-placement when the same cell is selected twice', async () => {
    const wrapper = mount(PlayerBoard, { props: { size: 5 } });
    const cell = wrapper.find('[data-cell="1-1"]');
    await cell.trigger('click');
    await cell.trigger('click'); // duplicate selection
    const invalid = wrapper.emitted('invalid-placement');
    expect(invalid).toBeTruthy();
    const payload = invalid![0][0];
    expect(payload.message).toBe('Duplicate cell selection is not allowed');
  });

  it('adds ship class to placed cells after successful placement', async () => {
    const wrapper = mount(PlayerBoard, { props: { size: 5 } });
    const start = wrapper.find('[data-cell="0-0"]');
    const end = wrapper.find('[data-cell="0-2"]');
    await start.trigger('click');
    await end.trigger('click');
    // after placement, cells 0-0, 0-1, 0-2 should have class ship
    const cell00 = wrapper.find('[data-cell="0-0"]');
    const cell01 = wrapper.find('[data-cell="0-1"]');
    const cell02 = wrapper.find('[data-cell="0-2"]');
    expect(cell00.classes()).toContain('ship');
    expect(cell01.classes()).toContain('ship');
    expect(cell02.classes()).toContain('ship');
  });
});

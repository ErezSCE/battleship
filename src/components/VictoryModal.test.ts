import { mount } from '@vue/test-utils';
import VictoryModal from './VictoryModal.vue';

describe('VictoryModal.vue', () => {
  it('displays the winner name', () => {
    const wrapper = mount(VictoryModal, {
      props: { winner: 'Player 1' },
    });
    const winnerText = wrapper.find('.victory-modal__winner').text();
    expect(winnerText).toContain('Player 1');
  });

  it('emits restart event when button is clicked', async () => {
    const wrapper = mount(VictoryModal, {
      props: { winner: 'Player 2' },
    });
    const button = wrapper.find('[data-test="restart-button"]');
    await button.trigger('click');
    expect(wrapper.emitted('restart')).toBeTruthy();
    expect(wrapper.emitted('restart')!.length).toBe(1);
  });
});

import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import BetCard from '../BetCard.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('component: BetCard', () => {
  let store;
  let getters;
  let actions;

  const testBet = {
    betId: '1',
    outcome: 1,
    winner: 'Levante',
    odds: 26200,
    eventDetails: {
      event_id: 63200,
      sport: 'Soccer',
      tournament: 'LaLiga',
      starting: 1581163200,
      tester: 2238,
      teams: { home: 'Levante', away: 'Leganés' },
      odds: [
        { mlHome: 26200, mlAway: 31900, mlDraw: 33600 },
        { spreadPoints: 0, spreadHome: 0, spreadAway: 0 },
        { totalsPoints: 25, totalsOver: 23400, totalsUnder: 17400 }
      ]
    },
    betType: null,
    handicap: null,
    totalValue: null,
    availability: true
  };

  describe('betType multi', () => {
    beforeEach(() => {
      getters = {
        convertOdds: () => () => 1.5,
        betType: () => 'multi',
        balance: () => 10000,
        pending: () => 0,
        immature: () => 0
      };

      actions = {
        removeBetFromSlip: jest.fn()
      };

      store = new Vuex.Store({
        getters,
        actions
      });
    });

    it('should correct render BetCard component', () => {
      expect.hasAssertions();
      const wrapper = shallowMount(BetCard, {
        propsData: {
          bet: testBet,
          wagerrCode: 'WGR',
          placeBet: jest.fn()
        },
        store,
        localVue
      });
      expect(wrapper.isVueInstance()).toBe(true);
    });

    it('should equal snapshot', () => {
      expect.hasAssertions();
      const wrapper = mount(BetCard, {
        propsData: {
          bet: testBet,
          wagerrCode: 'WGR',
          placeBet: jest.fn()
        },
        store,
        localVue
      });

      expect(wrapper.element).toMatchSnapshot();
    });

    it('should execute removeBetFromSlip action', () => {
      expect.hasAssertions();
      const wrapper = shallowMount(BetCard, {
        propsData: {
          bet: testBet,
          wagerrCode: 'WGR',
          placeBet: jest.fn()
        },
        store,
        localVue
      });
      wrapper.find('div.bet-card__clear-btn').trigger('click');

      expect(actions.removeBetFromSlip).toHaveBeenCalled();
    });
  });

  describe('betType single', () => {
    beforeEach(() => {
      getters = {
        convertOdds: () => () => 1.5,
        betType: () => 'single',
        balance: () => 10000,
        pending: () => 0,
        immature: () => 0
      };

      actions = {
        removeBetFromSlip: jest.fn()
      };

      store = new Vuex.Store({
        getters,
        actions
      });
    });

    it('should equal snapshot', () => {
      expect.hasAssertions();
      const wrapper = mount(BetCard, {
        propsData: {
          bet: testBet,
          wagerrCode: 'WGR',
          placeBet: jest.fn()
        },
        store,
        localVue
      });

      expect(wrapper.element).toMatchSnapshot();
    });

    it('should have correct input value', () => {
      expect.hasAssertions();
      const wrapper = shallowMount(BetCard, {
        propsData: {
          bet: testBet,
          wagerrCode: 'WGR',
          placeBet: jest.fn()
        },
        store,
        localVue
      });

      const input = wrapper.find('input');
      input.setValue('12');
      expect(wrapper.vm.betValue).toBe('12');
      expect(wrapper.vm.betValueNum).toBe(12);

      input.setValue('123');
      expect(wrapper.vm.betValue).toBe('123');
      expect(wrapper.vm.betValueNum).toBe(123);
    });

    it('should bet-button to be disabled', () => {
      expect.hasAssertions();
      const wrapper = shallowMount(BetCard, {
        propsData: {
          bet: testBet,
          wagerrCode: 'WGR',
          placeBet: jest.fn()
        },
        store,
        localVue
      });

      const button = wrapper.find('button');

      expect(button.classes('disabled')).toBe(true);
    });

    it('should execute placeBet with correct data', () => {
      expect.hasAssertions();
      const wrapper = shallowMount(BetCard, {
        propsData: {
          bet: testBet,
          wagerrCode: 'WGR',
          placeBet: jest.fn()
        },
        store,
        localVue
      });

      wrapper.find('input').setValue('26');
      wrapper.find('button').trigger('click');

      expect(wrapper.props('placeBet')).toHaveBeenCalledWith(
        '1',
        [{ eventId: 63200, outcome: 1 }],
        26
      );
    });
  });
});

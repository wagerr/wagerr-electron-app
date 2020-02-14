import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import BetSlip from '../BetSlip.vue';

jest.mock('@/services/api/wagerrRPC');

const localVue = createLocalVue();

localVue.use(Vuex);

describe('component: BetSlip', () => {
  let store;
  let getters;
  let actions;

  const testBets = [
    {
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
    },
    {
      betId: '2',
      outcome: 1,
      winner: 'Göztepe',
      odds: 18400,
      eventDetails: {
        event_id: 63374,
        sport: 'Soccer',
        tournament: 'Super Lig',
        starting: 1581354000,
        tester: 1435,
        teams: { home: 'Göztepe', away: 'Çaykur Rizespor' },
        odds: [
          { mlHome: 18400, mlAway: 50000, mlDraw: 40000 },
          { spreadPoints: 0, spreadHome: 0, spreadAway: 0 },
          { totalsPoints: 25, totalsOver: 20000, totalsUnder: 20000 }
        ]
      },
      betType: null,
      handicap: null,
      totalValue: null,
      availability: true
    },
    {
      betId: '3',
      outcome: 7,
      winner: 'Göztepe',
      odds: 20000,
      eventDetails: {
        event_id: 63374,
        sport: 'Soccer',
        tournament: 'Super Lig',
        starting: 1581354000,
        tester: 1435,
        teams: { home: 'Göztepe', away: 'Çaykur Rizespor' },
        odds: [
          { mlHome: 18400, mlAway: 50000, mlDraw: 40000 },
          { spreadPoints: 0, spreadHome: 0, spreadAway: 0 },
          { totalsPoints: 25, totalsOver: 20000, totalsUnder: 20000 }
        ]
      },
      betType: 'total',
      handicap: null,
      totalValue: 'Under2.5',
      availability: true
    }
  ];

  beforeEach(() => {
    getters = {
      balance: () => 10000,
      immature: () => 0,
      pending: () => 0,
      betSlip: () => testBets,
      getNumBets: () => 2,
      getNetworkType: () => 'Testnet',
      convertOdds: () => () => 1.5,
      betType: () => 'multi'
    };

    actions = {
      removeBetFromSlip: jest.fn(),
      clearBetSlip: jest.fn(),
      setBetType: jest.fn()
    };

    store = new Vuex.Store({
      getters,
      actions
    });
  });

  it('should render component', () => {
    expect.hasAssertions();
    const wrapper = shallowMount(BetSlip, {
      store,
      localVue
    });
    expect(wrapper.isVueInstance()).toBe(true);
  });

  it('should match snapshot', () => {
    expect.hasAssertions();
    const wrapper = mount(BetSlip, {
      store,
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should display correct input value', () => {
    expect.hasAssertions();
    const wrapper = shallowMount(BetSlip, {
      store,
      localVue
    });

    const input = wrapper.find('input');
    input.setValue('125');

    expect(input.element.value).toBe('125');
    expect(wrapper.vm.multiBetNumber).toBe(125);
  });

  it('should calculate correct multiBetNumber value', () => {
    expect.hasAssertions();
    const wrapper = shallowMount(BetSlip, {
      store,
      localVue
    });

    expect(wrapper.vm.multiBetNumber).toBe(0);

    const input = wrapper.find('input');
    input.setValue('125');

    expect(wrapper.vm.multiBetNumber).toBe(125);
  });

  it('should calculate correct multiPotentialWinnings value', () => {
    expect.hasAssertions();
    const wrapper = shallowMount(BetSlip, {
      store,
      localVue
    });
    expect(wrapper.vm.multiPotentialWinnings).toBe('0.00000000');

    const input = wrapper.find('input');
    input.setValue('125');

    expect(wrapper.vm.multiPotentialWinnings).toBe('1140.38800000');
  });

  it('should calculate correct wagerrCode', () => {
    expect.hasAssertions();
    const wrapper = shallowMount(BetSlip, {
      store,
      localVue
    });
    expect(wrapper.vm.wagerrCode).toBe(' tWGR');
  });

  it('should execute placeBet with correct params', () => {
    expect.hasAssertions();
    const wrapper = shallowMount(BetSlip, {
      store,
      localVue
    });
    const placeBetMock = jest.fn().mockResolvedValue(43);
    wrapper.setMethods({ placeBet: placeBetMock });

    const input = wrapper.find('input');
    input.setValue('125');

    wrapper
      .find('div.bet-slip__multi-summary')
      .find('button')
      .trigger('click');

    expect(placeBetMock).toHaveBeenCalledWith(
      null,
      [
        { eventId: 63200, outcome: 1 },
        { eventId: 63374, outcome: 1 },
        { eventId: 63374, outcome: 7 }
      ],
      125
    );
  });
});

import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import Event from '../Event.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('component: Event', () => {
  let store;
  let getters;
  let actions;

  const testEvent = {
    event_id: 63505,
    sport: 'Soccer',
    tournament: 'Cup',
    starting: 1581442200,
    tester: 1505,
    teams: { home: 'Fenerbahçe', away: 'Kirklarelispor' },
    odds: [
      { mlHome: 11800, mlAway: 196500, mlDraw: 86900 },
      {
        spreadPoints: 0,
        spreadHome: 0,
        spreadAway: 0
      },
      { totalsPoints: 25, totalsOver: 13700, totalsUnder: 36700 }
    ],
    show: {
      eventId: '63505',
      tournament: 'Cup',
      starting: 'Wed, Feb 12th 12:30 AM (+07:00 +07)',
      homeTeam: 'Fenerbahçe',
      awayTeam: 'Kirklarelispor',
      mlHomeOdds: 1.17,
      mlAwayOdds: 18.53,
      mlDrawOdds: 8.23,
      spreadHomeOdds: 0.06,
      spreadAwayOdds: 0.06,
      spreadPointsOdds: 0,
      totalsOverOdds: 1.35,
      totalsUnderOdds: 3.51,
      totalsPointsOdds: 2.5
    }
  };

  const testEvents = [
    {
      event_id: 63505,
      sport: 'Soccer',
      tournament: 'Cup',
      starting: 1581442200,
      tester: 1505,
      teams: { home: 'Fenerbahçe', away: 'Kirklarelispor' },
      odds: [
        { mlHome: 11800, mlAway: 196500, mlDraw: 86900 },
        { spreadPoints: 0, spreadHome: 0, spreadAway: 0 },
        { totalsPoints: 25, totalsOver: 13700, totalsUnder: 36700 }
      ],
      show: {
        eventId: '63505',
        tournament: 'Cup',
        starting: 'Wed, Feb 12th 12:30 AM (+07:00 +07)',
        homeTeam: 'Fenerbahçe',
        awayTeam: 'Kirklarelispor',
        mlHomeOdds: 1.17,
        mlAwayOdds: 18.53,
        mlDrawOdds: 8.23,
        spreadHomeOdds: 0.06,
        spreadAwayOdds: 0.06,
        spreadPointsOdds: 0,
        totalsOverOdds: 1.35,
        totalsUnderOdds: 3.51,
        totalsPointsOdds: 2.5
      }
    }
  ];

  beforeEach(() => {
    getters = {
      betSlip: () => [],
      eventsList: () => testEvents,
      betType: () => 'multi'
    };

    actions = {
      addBetToSlip: jest.fn()
    };

    store = new Vuex.Store({
      getters,
      actions
    });
  });

  it('should render component', () => {
    expect.hasAssertions();
    const wrapper = shallowMount(Event, {
      propsData: {
        event: testEvent
      },
      store,
      localVue
    });
    expect(wrapper.isVueInstance()).toBe(true);
  });

  it('should match snapshot', () => {
    expect.hasAssertions();
    const wrapper = mount(Event, {
      propsData: {
        event: testEvent
      },
      store,
      localVue
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should compute correct mlWinner', () => {
    expect.hasAssertions();
    const wrapper = shallowMount(Event, {
      propsData: {
        event: testEvent
      },
      store,
      localVue
    });
    expect(wrapper.vm.mlWinner).toBe('away');
  });

  it('should execute createBet method with correct arguments', () => {
    expect.hasAssertions();
    const wrapper = shallowMount(Event, {
      propsData: {
        event: testEvent
      },
      store,
      localVue
    });
    const createBetMock = jest.fn();

    wrapper.setMethods({ createBet: createBetMock });

    const buttonMlHome = wrapper.findAll('button.event__button');
    expect(buttonMlHome).toHaveLength(7);

    const mlHomeBtn = buttonMlHome.at(0);
    const mlAwayBtn = buttonMlHome.at(6);

    mlHomeBtn.trigger('click');
    mlAwayBtn.trigger('click');

    expect(wrapper.vm.createBet).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.createBet).toHaveBeenNthCalledWith(
      1,
      63505,
      1,
      'Fenerbahçe',
      11800
    );
    expect(wrapper.vm.createBet).toHaveBeenNthCalledWith(
      2,
      63505,
      7,
      'Fenerbahçe',
      36700,
      'total',
      null,
      'Under2.5'
    );
  });

  describe('betType: multi', () => {
    it('should compute correct disabledButtons: 1', () => {
      expect.hasAssertions();
      const wrapper = mount(Event, {
        propsData: {
          event: testEvent
        },
        store,
        localVue
      });
      expect(wrapper.vm.disabledButtons.size).toBe(0);
    });

    it('should compute correct disabledButtons: 2', () => {
      expect.hasAssertions();
      getters = {
        ...getters,
        betSlip: () => [
          {
            betId: 'bet-id_3',
            outcome: 1,
            winner: 'Fenerbahçe',
            odds: 11800,
            eventDetails: {
              event_id: 63505,
              sport: 'Soccer',
              tournament: 'Cup',
              starting: 1581442200,
              tester: 1505,
              teams: { home: 'Fenerbahçe', away: 'Kirklarelispor' },
              odds: [
                { mlHome: 11800, mlAway: 196500, mlDraw: 86900 },
                { spreadPoints: 0, spreadHome: 0, spreadAway: 0 },
                { totalsPoints: 25, totalsOver: 13700, totalsUnder: 36700 }
              ]
            },
            betType: null,
            handicap: null,
            totalValue: null,
            availability: true
          }
        ]
      };
      store = new Vuex.Store({
        getters,
        actions
      });

      const wrapper = mount(Event, {
        propsData: {
          event: testEvent
        },
        store,
        localVue
      });
      expect(wrapper.vm.disabledButtons.size).toBe(3);
      expect([...wrapper.vm.disabledButtons]).toStrictEqual([1, 2, 3]);
    });
  });
});

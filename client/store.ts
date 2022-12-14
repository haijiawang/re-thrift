import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
/**
 * Storage for data that needs to be accessed from various components.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown requests by (null = show all) // TODO: Update for different kinds of filtering
    colorFilter: null,
    sizeFilter: null,
    eventFilterCoord: null,
    eventFilterLoc: null,
    eventFilterStartDate: null,
    eventFilterEndDate: null,
    requests: [], // All requests created in the app
    events: [], // All events created in the app
    eventResponses: [], // All responses to events/requests created in the app
    username: null, // Username of the logged in user
    userlocation: null,
    usercontact: null,
    userDateJoined: null,
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setLocation(state, location) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.userlocation = location;
    },
    setContact(state, contact) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.usercontact = contact;
    },
    setDateJoined(state, dateJoined) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.userDateJoined = dateJoined;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored requests filter to the specified one.
       * @param filter - Username of the user to fitler requests by
       */
      state.filter = filter;
    },
    updateColorFilter(state, filter) {
      /**
       * Update the stored requests filter to the specified one.
       * @param filter - Username of the user to fitler requests by
       */
      state.colorFilter = filter;
    },
    updateSizeFilter(state, filter) {
      /**
       * Update the stored requests filter to the specified one.
       * @param filter - Username of the user to fitler requests by
       */
      state.sizeFilter = filter;
    },
    updateRequests(state, requests) {
      /**
       * Update the stored requests to the provided requests.
       * @param requests - Requests to store
       */
      state.requests = requests;
    },
    async refreshRequests(state) {
      /**
       * Request the server for the currently available requests.
       */
      const url = state.filter ? `/api/users/${state.filter}/requests` : '/api/requests'; // TODO: Update for different types of filtering
      const res = await fetch(url).then(async r => r.json());
      state.requests = res;
    },
    updateEventCoord(state, eventFilterCoord) {
      /**
       * Update the stored filter to the provided filter.
       * @param eventFilterCoord - Events filter
       */
      state.eventFilterCoord = eventFilterCoord;
    },
    updateEventStart(state, eventFilterStartDate) {
      /**
       * Update the stored filter to the provided filter.
       * @param eventFilterStartDate - Events filter
       */
      state.eventFilterStartDate = eventFilterStartDate;
    },
    updateEventEnd(state, eventFilterEndDate) {
      /**
       * Update the stored filter to the provided filter.
       * @param eventFilterEndDate - Events filter
       */
      state.eventFilterEndDate = eventFilterEndDate;
    },
    updateEventLocation(state, eventFilterLoc) {
      /**
       * Update the stored filter to the provided filter.
       * @param eventFilterLoc - Events filter
       */
      state.eventFilterLoc = eventFilterLoc;
    },
    updateEvents(state, events) {
      /**
       * Update the stored events to the provided events.
       * @param event - Events to store
       */
      state.events = events;
    },
    async refreshEvents(state) {
      /**
       * Request the server for the currently available events.
       */
      var url = '/api/events';
      if (state.eventFilterCoord && state.eventFilterStartDate && state.eventFilterEndDate && state.eventFilterLoc) {
        url = `/api/events?coordinator=${state.eventFilterCoord}&startrange=${state.eventFilterStartDate}&endrange=${state.eventFilterEndDate}&location=${state.eventFilterLoc}`;
      } else if (state.eventFilterCoord && state.eventFilterStartDate) {
        url = `/api/events?coordinator=${state.eventFilterCoord}&startrange=${state.eventFilterStartDate}&endrange=${state.eventFilterEndDate}`;
      } else if (state.eventFilterCoord && state.eventFilterLoc) {
        url = `/api/events?coordinator=${state.eventFilterCoord}&location=${state.eventFilterLoc}`;
      } else if (state.eventFilterLoc && state.eventFilterStartDate) {
        url = `/api/events?location=${state.eventFilterLoc}&startrange=${state.eventFilterStartDate}&endrange=${state.eventFilterEndDate}`;
      } else if (state.eventFilterCoord) {
        url = `/api/events?coordinator=${state.eventFilterCoord}`;
      } else if (state.eventFilterStartDate) {
        url = `/api/events?startrange=${state.eventFilterStartDate}&endrange=${state.eventFilterEndDate}`;
      } else if (state.eventFilterLoc) {
        url = `/api/events?location=${state.eventFilterLoc}`;
      }
      const res = await fetch(url).then(async r => r.json());
      state.events = res;
    },
    updateEventResponses(state, events) {
      /**
       * Update the stored events to the provided events.
       * @param event - Events to store
       */
      state.eventResponses = events;
    },
    async refreshEventResponses(state) {
      /**
       * Request the server for the currently available requests.
       */
      const url = '/api/eventResponses';
      const res = await fetch(url).then(async r => r.json());
      state.eventResponses = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;

var createStore = require('fluxible/addons/createStore');

var FetchBandStore = createStore({
  storeName: 'FetchBandStore',

  handlers: {
    'FETCH_BAND_START': 'start',
    'FETCH_BAND_FAILURE': 'failure',
    'FETCH_BAND_SUCCESS': 'success'
  },

  initialize: function() {
    this.working = false;
  },

  start: function() {
    this.working = true;
    this.emitChange();
  },

  failure: function(error) {
    this.working = false;
    this.emitChange();
  },

  success: function() {
    this.working = false;
    this.emitChange();
  },

  isLoadingMessages: function() {
    return this.working;
  },

  dehydrate: function() {
    return {
      working: this.working
    };
  },

  rehydrate: function(state) {
    this.working = state.working;
  }
});

module.exports = FetchBandStore;

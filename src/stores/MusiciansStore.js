'use strict';

var createStore = require('fluxible/addons/createStore');
var getHandlers = require('../utils/getHandlers');
var stores = require('../constants').STORE;
var actions = require('../constants').ACTION.MUSICIANS;

var MusicianStore = createStore({
  storeName: stores.MUSICIAN,

  handlers: getHandlers([
    [actions.FETCH_START, 'start'],
    [actions.FETCH_FAILURE, 'failure'],
    [actions.FETCH_SUCCESS, 'success']
  ]),

  initialize: function() {
    this.musicians = [];
  },

  start: function() {
    this.working = true;
    this.emitChange();
  },

  failure: function(error) {
    this.working = false;
    this.emitChange();
  },

  success: function(musicians) {
    this.musicians = musicians;
    this.working = false;
    this.emitChange();
  },

  getMusicians: function() {
    return this.musicians;
  },

  isLoading: function() {
    return this.working;
  },

  dehydrate: function() {
    return {
      musicians: this.musicians,
      working: this.working
    };
  },

  rehydrate: function(state) {
    this.musicians = state.musicians;
    this.working = state.working;
  }
});

module.exports = MusicianStore;

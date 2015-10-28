'use strict';

var createStore = require('fluxible/addons/createStore');
var getHandlers = require('../utils/getHandlers');
var stores = require('../constants').STORE;
var actions = require('../constants').ACTION.SONG;

var CreateSongStore = createStore({
  storeName: stores.CREATE_SONG,

  handlers: getHandlers([
    [actions.CREATE_START, 'start'],
    [actions.CREATE_FAILURE, 'failure'],
    [actions.CREATE_SUCCESS, 'success']
  ]),

  initialize: function() {
    this.working = false;
    this.error = null;
  },

  start: function() {
    this.working = true;
    this.error = null;
    this.emitChange();
  },

  failure: function(error) {
    this.working = false;
    this.error = error;
    this.emitChange();
  },

  success: function() {
    this.working = false;
    this.error = null;
    this.emitChange();
  },

  isCreatingSong: function() {
    return this.working;
  },

  getCreateSongError: function() {
    return this.error;
  },

  dehydrate: function() {
    return {
      working: this.working,
      error: this.error
    };
  },

  rehydrate: function(state) {
    this.working = state.working;
    this.error = state.error;
  }
});

module.exports = CreateSongStore;

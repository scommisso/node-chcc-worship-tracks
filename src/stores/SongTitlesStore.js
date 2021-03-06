'use strict';

var createStore = require('fluxible/addons/createStore');
var getHandlers = require('../utils/getHandlers');
var stores = require('../constants').STORE;
var actions = require('../constants').ACTION.SONG_TITLES;

var SongTitlesStore = createStore({
  storeName: stores.SONG_TITLES,

  handlers: getHandlers([
    [actions.FETCH_START, 'start'],
    [actions.FETCH_FAILURE, 'failure'],
    [actions.FETCH_SUCCESS, 'success'],
  ]),

  initialize: function() {
    this.songTitles = [];
  },

  start: function() {
    this.working = true;
    this.emitChange();
  },

  failure: function(error) {
    this.working = false;
    this.emitChange();
  },

  success: function(songs) {
    this.songTitles = songs;
    this.working = false;
    this.emitChange();
  },

  getSongTitles: function() {
    return this.songTitles;
  },

  isLoading: function() {
    return this.working;
  },

  dehydrate: function() {
    return {
      songTitles: this.songTitles,
      working: this.working
    };
  },

  rehydrate: function(state) {
    this.songTitles = state.songTitles;
    this.working = state.working;
  }
});

module.exports = SongTitlesStore;

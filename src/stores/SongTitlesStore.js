'use strict';

var createStore = require('fluxible/addons/createStore');
var getHandlers = require('../utils/getHandlers');
var stores = require('../constants').STORE;
var actions = require('../constants').ACTION.SONG_TITLES;

var SongStore = createStore({
  storeName: stores.SONG_TITLES,

  handlers: getHandlers([
    [actions.FETCH_SUCCESS, 'setSongTitles']
  ]),

  initialize: function() {
    this.songTitles = [];
  },

  setSongTitles: function(songs) {
    this.songTitles = songs;
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

module.exports = SongStore;

'use strict';

var createStore = require('fluxible/addons/createStore');
var getHandlers = require('../utils/getHandlers');
var stores = require('../constants').STORE;
var actions = require('../constants').ACTION.SONGS_BY_TITLE;
var titleActions = require('../constants').ACTION.SONG_TITLES;

var SongsByTitleStore = createStore({
  storeName: stores.SONGS_BY_TITLE,

  handlers: getHandlers([
    [actions.FETCH_START, 'start'],
    [actions.FETCH_FAILURE, 'failure'],
    [actions.FETCH_SUCCESS, 'success'],
    [titleActions.FETCH_TITLE_SUCCESS, 'titleSuccess']
  ]),

  initialize: function() {
    this.songs = [];
    this.songTitleSlug = null;
    this.songTitle = null;
    this.working = false;
  },

  setSongTitle: function(songTitle) {
    songTitle = toParamCase(songTitle);
    if (this.songTitleSlug && songTitle !== this.songTitleSlug) {
      this.songs = [];
      this.songTitle = null;
    }
    this.songTitleSlug = songTitle;
    this.emitChange();
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
    this.songs = songs;
    this.working = false;
    this.emitChange();
  },

  titleSuccess: function(songTitle) {
    this.songTitle = songTitle;
    this.emitChange();
  },

  getSongTitleSlug: function() {
    return this.songTitleSlug;
  },

  getSongTitle: function() {
    return this.songTitle;
  },

  getSongs: function() {
    return this.songs;
  },

  dehydrate: function() {
    return {
      songs: this.songs,
      songTitle: this.songTitle,
      songTitleSlug: this.songTitleSlug,
      working: this.working
    };
  },

  rehydrate: function(state) {
    this.songs = state.songs;
    this.songTitle = state.songTitle;
    this.songTitleSlug = state.songTitleSlug;
    this.working = state.working;
  }
});

module.exports = SongsByTitleStore;

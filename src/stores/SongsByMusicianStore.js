'use strict';

var createStore = require('fluxible/addons/createStore');
var getHandlers = require('../utils/getHandlers');
var stores = require('../constants').STORE;
var actions = require('../constants').ACTION.SONGS_BY_MUSICIAN;
var musicianActions = require('../constants').ACTION.MUSICIAN;

var SongsByMusicianStore = createStore({
  storeName: stores.SONGS_BY_MUSICIAN,

  handlers: getHandlers([
    [actions.FETCH_START, 'start'],
    [actions.FETCH_FAILURE, 'failure'],
    [actions.FETCH_SUCCESS, 'success'],
    [musicianActions.FETCH_SUCCESS, 'musicianSuccess']
  ]),

  initialize: function() {
    this.songs = [];
    this.musicianSlug = null;
    this.musician = null;
    this.working = false;
  },

  setMusician: function(musician) {
    musician = toParamCase(musician);
    if (this.musicianSlug && musician !== this.musicianSlug) {
      this.songs = [];
      this.musician = null;
    }
    this.musicianSlug = musician;
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
    this.emitChange();
  },

  musicianSuccess: function(musician) {
    this.musician = musician;
    this.emitChange();
  },

  isLoading: function() {
    return this.working;
  },

  getMusicianSlug: function() {
    return this.musicianSlug;
  },

  getMusician: function() {
    return this.musician;
  },

  getSongs: function() {
    return this.songs;
  },

  dehydrate: function() {
    return {
      songs: this.songs,
      musicianSlug: this.musicianSlug,
      musician: this.musician,
      working: this.working
    };
  },

  rehydrate: function(state) {
    this.songs = state.songs;
    this.musicianSlug = state.musicianSlug;
    this.musician = state.musician;
    this.working = state.working;
  }
});

module.exports = SongsByMusicianStore;

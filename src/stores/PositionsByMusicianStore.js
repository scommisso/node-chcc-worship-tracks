'use strict';

var createStore = require('fluxible/addons/createStore');
var getHandlers = require('../utils/getHandlers');
var stores = require('../constants').STORE;
var actions = require('../constants').ACTION.POSITIONS_BY_MUSICIAN;
var musicianActions = require('../constants').ACTION.MUSICIAN;

var PositionsByMusicianStore = createStore({
  storeName: stores.POSITIONS_BY_MUSICIAN,

  handlers: getHandlers([
    [actions.FETCH_START, 'start'],
    [actions.FETCH_FAILURE, 'failure'],
    [actions.FETCH_SUCCESS, 'success'],
    [musicianActions.FETCH_SUCCESS, 'musicianSuccess']
  ]),

  initialize: function() {
    this.positions = [];
    this.musicianSlug = null;
    this.musician = null;
    this.working = false;
  },

  setMusician: function(musician) {
    musician = toParamCase(musician);
    if (this.musicianSlug && musician !== this.musicianSlug) {
      this.positions = [];
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

  success: function(positions) {
    this.positions = positions;
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

  getPositions: function() {
    return this.positions;
  },

  dehydrate: function() {
    return {
      positions: this.positions,
      musicianSlug: this.musicianSlug,
      musician: this.musician,
      working: this.working
    };
  },

  rehydrate: function(state) {
    this.positions = state.positions;
    this.musicianSlug = state.musicianSlug;
    this.musician = state.musician;
    this.working = state.working;
  }
});

module.exports = PositionsByMusicianStore;

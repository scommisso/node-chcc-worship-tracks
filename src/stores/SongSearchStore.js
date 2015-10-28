'use strict';

var createStore = require('fluxible/addons/createStore');
var reduce = require('lodash/collection/reduce');
var values = require('lodash/object/values');
var getHandlers = require('../utils/getHandlers');
var stores = require('../constants').STORE;
var actions = require('../constants').ACTION.SONG_SEARCH;
var searchActions = require('../constants').ACTION.SEARCH;

var SongSearchStore = createStore({
  storeName: stores.SONG_SEARCH,

  handlers: getHandlers([
    [searchActions.CHANGED, 'setSearchData'],
    [actions.SEARCH_START, 'start'],
    [actions.SEARCH_FAILURE, 'failure'],
    [actions.SEARCH_SUCCESS, 'success']
  ]),

  initialize: function() {
    this.searchData = {
      query: null,
      exact: null,
      limit: null
    };
    this.working = false;
    this.songs = null;
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
    this.working = false;
    this.songs = songs;
    this.emitChange();
  },

  setSearchData: function (searchData) {
    this.searchData = searchData;
  },

  getSongs: function() {
    return this.songs;
  },

  isLoading: function() {
    return this.working;
  },

  getSearchData: function() {
    return this.searchData;
  },

  dehydrate: function() {
    return {
      songs: this.songs,
      searchData: this.searchData
    };
  },

  rehydrate: function(state) {
    this.working = false;
    this.songs = state.songs;
    this.searchData = state.searchData;
  }
});

module.exports = SongSearchStore;

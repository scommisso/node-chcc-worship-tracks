'use strict';

var createStore = require('fluxible/addons/createStore');
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
    this.searchResults = null;
  },

  start: function() {
    this.searchResults = null;
    this.working = true;
    this.emitChange();
  },

  failure: function(error) {
    this.working = false;
    this.emitChange();
  },

  success: function(searchResults) {
    this.working = false;
    this.searchResults = searchResults;
    this.emitChange();
  },

  setSearchData: function (searchData) {
    this.searchData = searchData;
  },

  getSearchResults: function() {
    return this.searchResults;
  },

  isLoading: function() {
    return this.working;
  },

  getSearchData: function() {
    return this.searchData;
  },

  dehydrate: function() {
    return {
      searchResults: this.searchResults,
      searchData: this.searchData
    };
  },

  rehydrate: function(state) {
    this.working = false;
    this.searchResults = state.searchResults;
    this.searchData = state.searchData;
  }
});

module.exports = SongSearchStore;

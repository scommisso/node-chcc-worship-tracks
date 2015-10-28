'use strict';

var createStore = require('fluxible/addons/createStore');
var reduce = require('lodash/collection/reduce');
var values = require('lodash/object/values');
var getHandlers = require('../utils/getHandlers');
var stores = require('../constants').STORE;
var songActions = require('../constants').ACTION.SONG;
var songListActions = require('../constants').ACTION.SONGS;

var SongStore = createStore({
  storeName: stores.SONG,

  handlers: getHandlers([
    [songListActions.FETCH_SUCCESS, 'setSongs'],
    [songActions.FETCH_SUCCESS, 'addSong'],
    [songActions.CREATE_SUCCESS, 'addSong']
  ]),

  initialize: function() {
    this.songsById = {};
  },

  setSongs: function(songs) {
    this.songsById = reduce(songs, function(result, song) {
      result[song.id] = song;
      return result;
    }, {});
    this.emitChange();
  },

  addSong: function(song) {
    this.songsById[song.id] = song;
    this.emitChange();
  },

  getSongs: function() {
    return values(this.songsById);
  },

  getSong: function(id) {
    return this.songsById[id];
  },

  dehydrate: function() {
    return {
      songsById: this.songsById
    };
  },

  rehydrate: function(state) {
    this.songsById = state.songsById;
  }
});

module.exports = SongStore;

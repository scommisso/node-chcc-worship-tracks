var createStore = require('fluxible/addons/createStore');
var reduce = require('lodash/collection/reduce');
var values = require('lodash/object/values');

var SongStore = createStore({
  storeName: 'SongTitlesStore',

  handlers: {
    'FETCH_SONG_TITLES_SUCCESS': 'setSongTitles'
  },

  initialize: function() {
    this.songTitles = [];
  },

  setSongTitles: function(songs) {
    this.songTitles = songs;
    this.emitChange();
  },

  getSongTitles: function() {
    return values(this.songTitles);
  },

  dehydrate: function() {
    return {
      songTitles: this.songTitles
    };
  },

  rehydrate: function(state) {
    this.songTitles = state.songTitles;
  }
});

module.exports = SongStore;

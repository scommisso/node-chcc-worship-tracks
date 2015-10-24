var createStore = require('fluxible/addons/createStore');
var reduce = require('lodash/collection/reduce');
var values = require('lodash/object/values');

var SongsByTitleStore = createStore({
  storeName: 'SongsByTitleStore',

  handlers: {
    'FETCH_SONGS_BY_TITLE_SUCCESS': 'setSongs'
  },

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

  getSongs: function() {
    return values(this.songsById);
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

module.exports = SongsByTitleStore;

var createStore = require('fluxible/addons/createStore');

var CreateSongStore = createStore({
  storeName: 'CreateSongStore',

  handlers: {
    'CREATE_SONG_START': 'start',
    'CREATE_SONG_FAILURE': 'failure',
    'CREATE_SONG_SUCCESS': 'success'
  },

  initialize: function() {
    this.working = false;
    this.error = null;
  },

  start: function() {
    this.working = true;
    this.error = null;
    this.emitChange();
  },

  failure: function(error) {
    this.working = false;
    this.error = error;
    this.emitChange();
  },

  success: function() {
    this.working = false;
    this.error = null;
    this.emitChange();
  },

  isCreatingSong: function() {
    return this.working;
  },

  getCreateSongError: function() {
    return this.error;
  },

  dehydrate: function() {
    return {
      working: this.working,
      error: this.error
    };
  },

  rehydrate: function(state) {
    this.working = state.working;
    this.error = state.error;
  }
});

module.exports = CreateSongStore;

var createStore = require('fluxible/addons/createStore');

var BandStore = createStore({
  storeName: 'BandStore',

  handlers: {
    'FETCH_BAND_SUCCESS': 'setBand'
  },

  initialize: function() {
    this.bandBySongId = {};
  },

  setBand: function(payload) {
    this.bandBySongId[payload.songId] = payload.band;
    this.emitChange();
  },

  getBand: function(songId) {
    return this.bandBySongId[songId] || [];
  },

  dehydrate: function() {
    return {
      bandBySongId: this.bandBySongId
    };
  },

  rehydrate: function(state) {
    this.bandBySongId = state.bandBySongId;
  }
});

module.exports = BandStore;

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var SongStore = require('../stores/SongStore');
var fetchSongs = require('../actions/fetchSongs');
var NewSong = require('./NewSong.jsx');
var SongListWidget= require('./SongListWidget.jsx');

var SongList = React.createClass({

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [SongStore],

    fetchData: function(context, params, query, done) {
      context.executeAction(fetchSongs, {}, done);
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      songs: this.getStore(SongStore).getSongs()
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  render: function() {
    return (
      <div>
        <h1>Song list</h1>
        <SongListWidget songs={this.state.songs} />
        <NewSong />
      </div>
    );
  }

});

module.exports = SongList;

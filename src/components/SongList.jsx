var React = require('react');
var map = require('lodash/collection/map');
var Router = require('react-router/build/npm/lib');
var Link = Router.Link;
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var SongStore = require('../stores/SongStore');
var fetchSongs = require('../actions/fetchSongs');
var NewSong = require('./NewSong.jsx');

var SongList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

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
      songs: this.getStore(SongStore).getSongs(),
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  render: function() {
    return (
      <div>
        <h1>Song list</h1>
        <ul>{this.renderSongs()}</ul>
        <NewSong />
      </div>
    );
  },

  renderSongs: function() {
    var songs = this.state.songs;
    return map(songs, function(song) {
      return (
        <li key={song.id}>
          <Link to="song-details" params={{id: song.id}}>
            {song.date} {song.title} {song.style ? '(' + song.style + ')' : ''}
          </Link>
        </li>
      );
    });
  }
});

module.exports = SongList;

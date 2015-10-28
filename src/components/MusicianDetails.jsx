var React = require('react');
var concurrent = require('contra').concurrent;
var map = require('lodash/collection/map');
var Router = require('react-router/build/npm/lib');
var Link = Router.Link;
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var SongsByMusicianStore = require('../stores/SongsByMusicianStore');
var PositionsByMusicianStore = require('../stores/PositionsByMusicianStore');
var fetchMusicianName = require('../actions/fetchMusicianName');
var fetchSongsByMusician = require('../actions/fetchSongsByMusician');
var fetchPositionsByMusician = require('../actions/fetchPositionsByMusician');

var MusicianDetails = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [SongsByMusicianStore, PositionsByMusicianStore],

    fetchData: function(context, params, query, done) {
        concurrent([
          context.executeAction.bind(context, fetchMusicianName, {musicianSlug: params.musician}),
          context.executeAction.bind(context, fetchSongsByMusician, {musician: params.musician}),
          context.executeAction.bind(context, fetchPositionsByMusician, {musician: params.musician})
        ], done);
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      musician: this.getStore(PositionsByMusicianStore).getMusician(),
      songs: this.getStore(SongsByMusicianStore).getSongs(),
      positions: this.getStore(PositionsByMusicianStore).getPositions(),
      songsLoading: this.getStore(SongsByMusicianStore).isLoading(),
      positionsLoading: this.getStore(PositionsByMusicianStore).isLoading()
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  render: function() {
    return (
      <div>
        <h1>{this.state.musician}</h1>
        <h2>Positions</h2>
        <ul>{this.renderPositions()}</ul>
        <h2>Songs ({this.state.songs.length})</h2>
        <ul>{this.renderSongs()}</ul>
      </div>
    );
  },

  renderPositions: function() {
    var positions = this.state.positions;
    return map(positions, function(position) {
      return (
        <li key={position}>{position}</li>
      );
    });
  },

  getStyleString: function(song) {
    if (!song.style) { return ''; }
    return ' (' + song.style + ')';
  },

  renderSongs: function() {
    var songs = this.state.songs;
    var getStyleString = this.getStyleString;
    return map(songs, function(song) {
      return (
        <li key={song.id}>
          <Link to="song-details" params={{id: song.id}}>
            {song.date} - {song.title + getStyleString(song)}
          </Link>
        </li>
      );
    });
  }
});

module.exports = MusicianDetails;

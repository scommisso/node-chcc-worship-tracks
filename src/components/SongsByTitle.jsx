var React = require('react');
var concurrent = require('contra').concurrent;
var map = require('lodash/collection/map');
var Router = require('react-router');
var Link = Router.Link;
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var SongsByTitleStore = require('../stores/SongsByTitleStore');
var fetchSongTitle = require('../actions/fetchSongTitle');
var fetchSongsByTitle = require('../actions/fetchSongsByTitle');

var SongsByTitle = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [SongsByTitleStore],

    fetchData: function(context, params, query, done) {
      concurrent([
        context.executeAction.bind(context, fetchSongTitle, {titleSlug: params.title}),
        context.executeAction.bind(context, fetchSongsByTitle, {songTitle: params.title})
      ], done);
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      songTitle: this.getStore(SongsByTitleStore).getSongTitle(),
      songs: this.getStore(SongsByTitleStore).getSongs()
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  render: function() {
    var songs = this.state.songs;
    var songCount = songs && songs.length;
    return (
      <div className="row">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              <h1>{this.state.songTitle} <span className="badge badge-lg">{songCount}</span></h1>
            </h3>
          </div>
          <ul className="list-group">{this.renderSongs(songs)}</ul>
        </div>
      </div>
    );
  },

  getStyleString: function(song) {
    if (!song.style) { return ''; }
    return ' (' + song.style + ')';
  },

  renderSongs: function(songs) {
    var getStyleString = this.getStyleString;
    return map(songs, function(song) {
      return (
        <li className="list-group-item" key={song.id}>
          <Link to="song-details" params={{id: song.id}}>
            {song.date} - {song.title + getStyleString(song)}
          </Link>
        </li>
      );
    });
  }
});

module.exports = SongsByTitle;

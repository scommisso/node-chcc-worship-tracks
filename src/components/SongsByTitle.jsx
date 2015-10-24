var React = require('react');
var map = require('lodash/collection/map');
var Router = require('react-router/build/npm/lib');
var Link = Router.Link;
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var SongsByTitleStore = require('../stores/SongsByTitleStore');
var fetchSongsByTitle = require('../actions/fetchSongsByTitle');

var SongsByTitle = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [SongsByTitleStore],

    fetchData: function(context, params, query, done) {
      context.executeAction(fetchSongsByTitle, { songTitle: params.title }, done);
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      songs: this.getStore(SongsByTitleStore).getSongs(),
    };
  },

  getSongTitle: function() {
    return this.context.router.getCurrentParams().title;
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  render: function() {
    return (
      <div>
        <h1>{this.getSongTitle()}</h1>
        <ul>{this.renderSongs()}</ul>
      </div>
    );
  },

  renderSongs: function() {
    var songs = this.state.songs;
    console.log('SONGS BY TITLE', songs)
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

module.exports = SongsByTitle;

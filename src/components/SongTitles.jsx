var React = require('react');
var map = require('lodash/collection/map');
var Router = require('react-router/build/npm/lib');
var Link = Router.Link;
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var SongTitlesStore = require('../stores/SongTitlesStore');
var fetchSongTitles = require('../actions/fetchSongTitles');

var SongList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [SongTitlesStore],

    fetchData: function(context, params, query, done) {
      context.executeAction(fetchSongTitles, {}, done);
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      songTitles: this.getStore(SongTitlesStore).getSongTitles(),
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
      </div>
    );
  },

  renderSongs: function() {
    var songs = this.state.songTitles;
    return map(songs, function(song) {
      return (
        <li key={song}>
          <Link to="songs-by-title" params={{title: song}}>
            {song}
          </Link>
        </li>
      );
    });
  }
});

module.exports = SongList;

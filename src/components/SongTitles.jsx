var React = require('react');
var map = require('lodash/collection/map');
var toParamCase = require('change-case').paramCase;
var Router = require('react-router/build/npm/lib');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var SongTitlesStore = require('../stores/SongTitlesStore');
var SongSearchStore = require('../stores/SongSearchStore');

var fetchSongTitles = require('../actions/fetchSongTitles');
var searchSongs = require('../actions/searchSongs');

var Link = Router.Link;
var SongSearch = require('./SongSearch.jsx');
var Loading = require('./Loading.jsx');

var SongList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [SongTitlesStore, SongSearchStore],

    fetchData: function(context, params, query, done) {
      if (query.query) {
        series([
          context.executeAction.bind(context, fetchSongTitles, {}),
          context.executeAction.bind(context, searchSongs, {query: query.query, exact: query.exact, limit: query.limit}),
        ], done);
      } else {
        context.executeAction(fetchSongTitles, {}, done);
      }
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      songTitles: this.getStore(SongTitlesStore).getSongTitles(),
      songSearchResults: this.getStore(SongSearchStore).getSongs(),
      loading: this.getStore(SongSearchStore).isLoading()
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  render: function() {
    return (
      <div>
        <div>
          <SongSearch />
        </div>
        {this.renderLoading()}
        <div>{this.renderData()}</div>
      </div>
    );
  },

  renderData: function() {
    var searchResult = this.state.songSearchResults;
    var hasSearchResults = searchResult && searchResult.length;
    if (hasSearchResults) {
      return (
        <div>
          <h1>Search Results ({hasSearchResults})</h1>
          <ul>{this.renderSearchResults()}</ul>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Song list</h1>
          <ul>{this.renderSongs()}</ul>
        </div>
      );
    }
  },

  renderSearchResults: function() {
    var songs = this.state.songSearchResults;
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
  },

  renderSongs: function() {
    var songs = this.state.songTitles;
    return map(songs, function(song) {
      return (
        <li key={song}>
          <Link to="songs-by-title" params={{title: toParamCase(song.trim())}}>
            {song}
          </Link>
        </li>
      );
    });
  },

  getStyleString: function(song) {
    if (!song.style) { return ''; }
    return ' (' + song.style + ')';
  },

  renderLoading: function() {
    if (!this.state.loading) {
      return null;
    }

    return <Loading />;
  }
});

module.exports = SongList;

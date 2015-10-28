var React = require('react');
var map = require('lodash/collection/map');
var toParamCase = require('change-case').paramCase;
var Router = require('react-router');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var SongTitlesStore = require('../stores/SongTitlesStore');
var fetchSongTitles = require('../actions/fetchSongTitles');

var Link = Router.Link;
var Loading = require('./Loading.jsx');

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
      loading: this.getStore(SongTitlesStore).isLoading()
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  render: function() {
    return (
      <div>
        {this.renderLoading()}
        <div>{this.renderData()}</div>
      </div>
    );
  },

  renderData: function() {
    var songTitles = this.state.songTitles;
    var songCount = songTitles && songTitles.length;
    return (
      <div className="row">
        <div className="panel panel-default">
          <div className="panel-heading">
            <div className="panel-title">
              <h1>Song List <span className="badge badge-lg">{songCount}</span></h1>
            </div>
          </div>
          <ul className="list-group">{this.renderSongs(songTitles)}</ul>
        </div>
      </div>
    );
  },

  renderSongs: function(songs) {
    return map(songs, function(song) {
      return (
        <li className="list-group-item" key={song}>
          <Link to="songs-by-title" params={{title: toParamCase(song.trim())}}>
            {song}
          </Link>
        </li>
      );
    });
  },

  renderLoading: function() {
    if (!this.state.loading) {
      return null;
    }

    return <Loading />;
  }
});

module.exports = SongList;

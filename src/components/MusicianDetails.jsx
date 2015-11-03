var React = require('react');
var concurrent = require('contra').concurrent;
var map = require('lodash/collection/map');
var Router = require('react-router');
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
        <div className="page-header">
          <h1>{this.state.musician}</h1>
          <p className="lead">
            <em>{this.renderPositions()}</em>
          </p>
        </div>
        <div className="row">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                Songs <span className="badge">{this.state.songs.length}</span>
              </h3>
            </div>
            <ul className="list-group">{this.renderSongs()}</ul>
          </div>
        </div>
      </div>);
  },

  renderPositions: function() {
    var positions = this.state.positions;
    return positions.join(', ');
  },

  getStyleString: function(song) {
    if (!song.style) { return ''; }
    return ' (' + song.style + ')';
  },

  getSongDisplayText: function(song) {
    var text = song.date + ' - ' + song.title + this.getStyleString(song);
    var lead = song.band.filter(function (bm) { return bm.position === 'lead vocal'; })[0];
    if (lead) {
      text += ', lead: ' + lead.name;
    }
    return text;
  },

  renderSongs: function() {
    var songs = this.state.songs;
    var getSongDisplayText = this.getSongDisplayText;
    return map(songs, function(song) {
      return (
        <li className="list-group-item" key={song.id}>
          <Link to="song-details" params={{id: song.id}}>
            {getSongDisplayText(song)}
          </Link>
        </li>
      );
    });
  }
});

module.exports = MusicianDetails;

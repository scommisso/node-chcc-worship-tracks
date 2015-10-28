var React = require('react');
var map = require('lodash/collection/map');
var toParamCase = require('change-case').paramCase;
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var Router = require('react-router/build/npm/lib');
var Link = Router.Link;
var SongStore = require('../stores/SongStore');
var fetchSong = require('../actions/fetchSong');

var SongDetails = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [SongStore],

    fetchData: function(context, params, query, done) {
      context.executeAction(fetchSong, {songId: params.id}, done);
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      song: this.getStore(SongStore).getSong(this.getSongId())
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  getSongId: function() {
    return this.context.router.getCurrentParams().id;
  },

  render: function() {
    return (
      <div>
        <h1>Song details</h1>
        <p>
          <Link to="song-titles">
            Back to songs
          </Link>
        </p>
        {this.renderSong()}
        <h2>Band</h2>
        {this.renderBand()}
      </div>
    );
  },

  renderSong: function() {
    var song = this.state.song;
    if (!song) {
      return null;
    }
    var footer = '';
    var getStyleString = this.getStyleString;
    var renderStyleItem = this.renderStyleItem;
    return (
      <ul>
        <li><strong>Date: </strong>{song.date}</li>
        <li><strong>Title: </strong>{song.title}</li>
        {renderStyleItem(song)}
        <li><strong>Video: </strong>
          <a href={song.video} title={song.title + getStyleString(song)} target="_blank">
            {song.title + getStyleString(song)}
          </a>
        </li>
        <li><strong>Audio: </strong>
          <a href={song.audio} title={song.title + getStyleString(song)} target="_blank">
            {song.title + getStyleString(song)}
          </a>
        </li>
      </ul>
    );
  },

  renderStyleItem: function(song) {
    if (!song.style) { return ''; }
    return (<li><strong>Style: </strong>{song.style}</li>);
  },

  getStyleString: function(song) {
    if (!song.style) { return ''; }
    return ' (' + song.style + ')';
  },

  renderBand: function() {
    var band = this.state.song.band;
    return map(band, function(bandMember, index) {
      return (
        <li key={index}>
          <span><strong>{bandMember.position}</strong>: </span>
          <Link to="musician-details" params={{musician: toParamCase(bandMember.name.trim())}}>
            {bandMember.name}
          </Link>
        </li>
      );
    });
  }
});

module.exports = SongDetails;

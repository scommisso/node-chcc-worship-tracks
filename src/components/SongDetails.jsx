var React = require('react');
var map = require('lodash/collection/map');
var toParamCase = require('change-case').paramCase;
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var Router = require('react-router');
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
    var song = this.state.song;
    if (!song) { return null; }
    return (
      <div>
        <div className="page-header">
          <h1>{song.title}</h1>
          <p className="lead">
            <em>{song.date + this.renderStyle(song)}</em>
          </p>
          {this.renderLinks(song)}
        </div>
        <div className="row">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">
                Band <span className="badge">{song.band.length}</span>
              </h3>
            </div>
            <ul className="list-group">{this.renderBand()}</ul>
          </div>
        </div>
      </div>);
  },

  renderLinks: function(song) {
    return (
      <ul className="list-group">
        {this.renderAudioLink(song)}
        {this.renderVideoLink(song)}
        {this.renderPlanLink(song)}
      </ul>);
  },

  renderAudioLink: function(song) {
    if (!song.audio) { return ''; }
    return (
      <li className="list-group-item"><strong>Audio: </strong>
        <a href={song.audio} title={song.title + this.getStyleString(song)} target="_blank">
          {song.title + this.getStyleString(song)}
        </a>
      </li>
      );
  },

  renderVideoLink: function(song) {
    if (!song.video) { return ''; }
    return (
      <li className="list-group-item"><strong>Video: </strong>
        <a href={song.video} title={song.title + this.getStyleString(song)} target="_blank">
          {song.title + this.getStyleString(song)}
        </a>
      </li>
      );
  },

  renderPlanLink: function(song) {
    if (!song.planningCenter || !song.planningCenter.plan) { return ''; }
    return (
      <li className="list-group-item"><strong>Plan: </strong>
        <a href={song.planningCenter.plan} title={song.date} target="_blank">
          Service for {song.date}
        </a>
      </li>
      );
  },

  renderStyleItem: function(song) {
    if (!song.style) { return ''; }
    return (<li><strong>Style: </strong>{song.style}</li>);
  },

  renderStyle: function(song) {
    if (!song.style) { return ''; }
    return ', ' + song.style;
  },

  getStyleString: function(song) {
    if (!song.style) { return ''; }
    return ' (' + song.style + ')';
  },

  renderBand: function() {
    var band = this.state.song.band;
    return map(band, function(bandMember, index) {
      return (
        <li className="list-group-item" key={index}>
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

var React = require('react');
var concurrent = require('contra').concurrent;
var map = require('lodash/collection/map');
var Router = require('react-router/build/npm/lib');
var Link = Router.Link;
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var SongStore = require('../stores/SongStore');
var BandStore = require('../stores/BandStore');
var FetchBandStore = require('../stores/FetchBandStore');
var fetchSong = require('../actions/fetchSong');
var fetchBand = require('../actions/fetchBand');
var Loading = require('./Loading.jsx');

var SongBand = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [SongStore, BandStore, FetchBandStore],

    fetchData: function(context, params, query, done) {
      concurrent([
        context.executeAction.bind(context, fetchSong, {songId: params.id}),
        context.executeAction.bind(context, fetchBand, {songId: params.id})
      ], done || function() {});
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      song: this.getStore(SongStore).getSong(this.getSongId()),
      band: this.getStore(BandStore).getBand(this.getSongId()),
      loading: this.getStore(FetchBandStore).isLoadingMessages()
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
    return (
      <div>
        <h1>Song Band</h1>
        <p>
          <Link to="songs">
            Back to songs
          </Link>
          {' - '}
          <Link to="song-details" params={{id: this.getSongId()}}>
            Song details
          </Link>
          <h1>{song.date} {song.title} {song.style}</h1>
        </p>
        {this.renderLoading()}
        {this.renderBand()}
      </div>
    );
  },

  renderLoading: function() {
    if (!this.state.loading) {
      return null;
    }

    return <Loading />;
  },

  renderBand: function() {
    var song = this.state.song;
    var band = this.state.band;
    return map(band, function(bandMember, index) {
      return (
        <li>
          <strong>{bandMember.name + ': '}</strong>
          {bandMember.position}
        </li>
      );
    });
  }
});

module.exports = SongBand;

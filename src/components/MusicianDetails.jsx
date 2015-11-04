var React = require('react');
var concurrent = require('contra').concurrent;
var map = require('lodash/collection/map');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var SongsByMusicianStore = require('../stores/SongsByMusicianStore');
var PositionsByMusicianStore = require('../stores/PositionsByMusicianStore');
var fetchMusicianName = require('../actions/fetchMusicianName');
var fetchSongsByMusician = require('../actions/fetchSongsByMusician');
var fetchPositionsByMusician = require('../actions/fetchPositionsByMusician');

var SongListWidget= require('./SongListWidget.jsx');

var MusicianDetails = React.createClass({

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
            <SongListWidget songs={this.state.songs} />
          </div>
        </div>
      </div>);
  },

  renderPositions: function() {
    var positions = this.state.positions;
    return positions.join(', ');
  }

});

module.exports = MusicianDetails;

var React = require('react');
var map = require('lodash/collection/map');
var Router = require('react-router');
var Link = Router.Link;
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var SongStore = require('../stores/SongStore');
var fetchSongs = require('../actions/fetchSongs');
var NewSong = require('./NewSong.jsx');

var SongList = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [SongStore],

    fetchData: function(context, params, query, done) {
      context.executeAction(fetchSongs, {}, done);
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      songs: this.getStore(SongStore).getSongs()
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
        <NewSong />
      </div>
    );
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
        <li key={song.id}>
          <Link to="song-details" params={{id: song.id}}>
            {getSongDisplayText(song)}
          </Link>
        </li>
      );
    });
  }
});

module.exports = SongList;

var React = require('react');
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
          {' - '}
          <Link to="song-band" params={{id: this.getSongId()}}>
            Song band members
          </Link>
        </p>
        {this.renderSong()}
      </div>
    );
  },

  renderSong: function() {
    var song = this.state.song;
    if (!song) {
      return null;
    }
    var footer = '';
    return (
      <ul>
        <li><strong>Date: </strong>{song.date}</li>
        <li><strong>Title: </strong>{song.title}</li>
        <li><strong>Style: </strong>{song.style}</li>
        <li><a href={song.video} title={song.title + ' ' + song.style} target="_blank">
          Video - {song.title + ' ' + song.style}
        </a></li>
        <li><a href={song.audio} title={song.title + ' ' + song.style} target="_blank">
          Audio - {song.title + ' ' + song.style}
        </a></li>
      </ul>
    );
  }
});

module.exports = SongDetails;

'use strict';

var React = require('react');
var map = require('lodash/collection/map');
var Router = require('react-router');
var Link = Router.Link;

var SongListWidget = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render: function() {
    if (!Array.isArray(this.props.songs) || !this.props.songs.length) {
      return (<span></span>);
    }
    return (
      <ul className="list-group">
        {this.renderSongs()}
      </ul>
    );
  },

  renderSongs: function() {
    var renderSong = this.renderSong;
    return map(this.props.songs, function(song) {
      return (
        <li className="list-group-item" key={song.id}>
            {renderSong(song)}
        </li>
      );
    });
  },

  renderSong: function(song) {
    return (
      <h4>
        <Link to="song-details" params={{id: song.id}}>
          {song.title}
          {this.getStyleString(song)}
        </Link>
        {' '}
        <small>
          {song.date}
          {' '}
          <em>feat.</em>
          {' '}
          <strong>{this.getLeadsString(song)}</strong>
        </small>
      </h4>
    );
  },

  getStyleString: function(song) {
    if (!song.style) { return ''; }
    return ' (' + song.style + ')';
  },

  getLeadsString: function(song) {
    return song.band
      .filter(function (bm) { return bm.position === 'lead vocal'; })
      .map(function (bm) { return bm.name; })
      .join(', ');
  }

});

module.exports = SongListWidget;

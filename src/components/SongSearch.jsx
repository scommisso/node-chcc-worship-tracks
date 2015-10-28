var React = require('react');
var series = require('contra').series;
var map = require('lodash/collection/map');
var Router = require('react-router');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var SongSearchStore = require('../stores/SongSearchStore');
var setSearchCriteria = require('../actions/setSearchCriteria');
var searchSongs = require('../actions/searchSongs');

var Link = Router.Link;
var SongSearch = require('./SongSearch.jsx');
var Loading = require('./Loading.jsx');

var SearchSongs = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [SongSearchStore],

    fetchData: function(context, params, query, done) {
      if (query.query) {
        series([
          context.executeAction.bind(context, searchSongs, {query: query.query, exact: query.exact, limit: query.limit}),
          context.executeAction.bind(context, setSearchCriteria, {query: query.query, exact: query.exact, limit: query.limit})
        ], done);
      } else {
        context.executeAction(setSearchCriteria, {query: query.query, exact: query.exact, limit: query.limit}, done);
      }
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      searchCriteria: this.getStore(SongSearchStore).getSearchData(),
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
          <form action="/search" onSubmit={this.handleSearch}>
            {this.renderSearch()}
          </form>
          {this.renderError()}
        </div>
        {this.renderLoading()}
        <div>{this.renderData()}</div>
      </div>
    );
  },

  renderData: function() {
    var searchResult = this.state.songSearchResults;
    var searchResultCount = searchResult && searchResult.length;
    if (!searchResultCount) { return ''; }
    return (
      <div className="row">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              <h1>Search Results <span className="badge badge-lg">{searchResultCount}</span></h1>
            </h3>
          </div>
          <div className="panel-body">
            <ul className="list-group">{this.renderSearchResults()}</ul>
          </div>
        </div>
      </div>
    );
  },

  renderSearchResults: function() {
    var songs = this.state.songSearchResults;
    var getStyleString = this.getStyleString;
    return map(songs, function(song) {
      return (
        <li className="list-group-item" key={song.id}>
          <Link to="song-details" params={{id: song.id}}>
            {song.date} - {song.title + getStyleString(song)}
          </Link>
        </li>
      );
    });
  },

  renderSearch: function() {
    var disabled;
    var text = 'Search for...';

    if (this.state.working) {
      disabled = true;
      text = 'Searching...';
    }

    return (
      <div className="input-group">
        <input type="text" className="form-control" ref="song_search_text" name="song_search_text" placeholder={text} />
        <span className="input-group-btn">
          <button className="btn btn-default" type="submit" disabled={disabled} style={{paddingTop: '9px', paddingBottom: '9px'}}>
            <span className="glyphicon glyphicon-search"></span>
          </button>
        </span>
      </div>
    );
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
  },

  renderError: function() {
    var error = this.state.error;
    if (!error) {
      return null;
    }
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Oh snap! </strong>
        An error occurred while searching the song database. Please try again.
      </div>
      );
  },

  handleSearch: function(e) {
    e.preventDefault();
    var search = this.refs.song_search_text.getDOMNode().value.trim();
    if (!search) { return; }

    var searchData = this.getStateFromStores().searchCriteria;
    searchData.query = search;

    this.context.executeAction(setSearchCriteria, searchData);
    this.context.executeAction(searchSongs, searchData);
  }

});

module.exports = SearchSongs;

var React = require('react');
var series = require('contra').series;
var map = require('lodash/collection/map');
var pluralize = require('pluralize')
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var SongSearchStore = require('../stores/SongSearchStore');
var setSearchCriteria = require('../actions/setSearchCriteria');
var searchSongs = require('../actions/searchSongs');

var Loading = require('./Loading.jsx');
var SongListWidget= require('./SongListWidget.jsx');

var SearchSongs = React.createClass({
  
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
        context.executeAction(setSearchCriteria, {}, done);
      }
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      searchCriteria: this.getStore(SongSearchStore).getSearchData(),
      songSearchResults: this.getStore(SongSearchStore).getSearchResults(),
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
        <h3>Example searches:</h3>
        <blockquote>
          <dl>
            <dt>norm corner</dt>
            <dd>Songs containing "corner" that Norm has performed</dd>
            <dt>loves acoustic</dt>
            <dd>Songs containing "loves" in the acoustic style</dd>
            <dt>lead: brian</dt>
            <dd>Songs where Brian sings lead vocals</dd>
            <dt>cello: erdis</dt>
            <dd>Songs where Erdis plays cello</dd>
          </dl>
        </blockquote>
      </div>
    );
  },

  renderData: function() {
    var searchResult = this.state.songSearchResults;
    var fullCount = (searchResult && searchResult.full && searchResult.full.length) || 0;
    var partialCount = (searchResult && searchResult.partial && searchResult.partial.length)|| 0;
    var totalCount = fullCount + partialCount;
    if (!totalCount) {
      if (!this.state.searchCriteria || !this.state.searchCriteria.query) { return ''; }
      return (
        <div className="row">
          <div className="panel panel-default">
            <div className="panel-body">
              <em>No matches found</em>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="panel panel-default">
          <div className="panel-heading">
            <div className="panel-title">
              <h1>Search Results <span className="badge badge-lg">{totalCount}</span></h1>
            </div>
          </div>
          <div className="panel-body">
            {this.renderSearchResults(searchResult, fullCount, partialCount)}
          </div>
        </div>
      </div>
    );
  },

  renderSearchResults: function(searchResult, fullCount, partialCount) {
    return (
      <div id="search-accordion" className="panel-group">
        <div className="panel panel-success">
          <div className="panel-heading panel-heading-collapse" data-toggle="collapse" data-parent="#search-accordion" data-target="#collapse-full">
            <h3 className="panel-title">
              <em>{fullCount} Full {pluralize('Match', fullCount)}</em>
            </h3>
          </div>
          <div id="collapse-full" className={this.getFullPanelClassName(fullCount)}>
            <ul className="list-group">
              <SongListWidget songs={searchResult.full} />
            </ul>
          </div>
        </div>
        <div className="panel panel-warning">
          <div className="panel-heading panel-heading-collapse" data-toggle="collapse" data-parent="#search-accordion" data-target="#collapse-partial">
            <h3 className="panel-title">
              <em>{partialCount} Partial {pluralize('Match', partialCount)}</em>
            </h3>
          </div>
          <div id="collapse-partial" className={this.getPartialPanelClassName(fullCount, partialCount)}>
            <ul className="list-group">
              <SongListWidget songs={searchResult.partial} />
            </ul>
          </div>
        </div>
      </div>
      );
  },

  getFullPanelClassName: function(fullCount) {
    var className = 'panel-collapse collapse';
    if (fullCount > 0) { className += ' in'; }
    return className;
  },

  getPartialPanelClassName: function(fullCount, partialCount) {
    var className = 'panel-collapse collapse';
    if (fullCount <= 0 && partialCount > 0) { className += ' in'; }
    return className;
  },

  renderSearch: function() {
    var disabled;
    var text = 'Search for...';
    var query = this.state.searchCriteria && this.state.searchCriteria.query;

    if (this.state.working) {
      disabled = true;
      text = 'Searching...';
    }

    return (
      <div className="input-group">
        <input type="text" className="form-control" ref="song_search_text" name="song_search_text" placeholder={text} defaultValue={query} />
        <span className="input-group-btn">
          <button className="btn btn-default" type="submit" disabled={disabled} style={{paddingTop: '9px', paddingBottom: '9px'}}>
            <span className="glyphicon glyphicon-search"></span>
          </button>
        </span>
      </div>
    );
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

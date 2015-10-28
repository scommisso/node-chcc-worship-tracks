var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var SongSearchStore = require('../stores/SongSearchStore');
var setSearchCriteria = require('../actions/setSearchCriteria');
var setSearchCriteria = require('../actions/searchSongs');

var SearchSongs = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [SongSearchStore],

    fetchData: function(context, params, query, done) {
      context.executeAction(setSearchCriteria, {query: query.query, exact: query.exact, limit: query.limit}, done);
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      searchCriteria: this.getStore(SongSearchStore).getSearchData()
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  render: function() {
    return (
      <div>
        <form action="/songSearch" onSubmit={this.handleSearch}>
          <p>
            <input ref="song_search_text" name="song_search_text" placeholder="Search" />
            <span style={{display: 'none'}}>Exact Match <input type="checkbox" ref="song_search_exact_match" name="song_search_exact_match" /></span>
            {' '}
            {this.renderButton()}
          </p>
        </form>
        {this.renderError()}
      </div>
    );
  },

  renderButton: function() {
    var disabled;
    var text = 'Search';

    if (this.state.working) {
      disabled = true;
      text = 'Searching...';
    }

    return (
      <button
        type="submit"
        disabled={disabled}>
        {text}
      </button>
    );
  },

  handleSearch: function(e) {
    e.preventDefault();
    var search = this.refs.song_search_text.getDOMNode().value.trim();
    if (!search) { return; }
    var exact = this.refs.song_search_exact_match.getDOMNode().checked;

    var searchData = this.getStateFromStores().searchCriteria;
    searchData.query = search;
    searchData.exact = exact;

    this.context.executeAction(setSearchCriteria, searchData);
    this.context.executeAction(searchSongs, searchData);
  },

  renderError: function() {
    var error = this.state.error;
    if (!error) {
      return null;
    }

    return <p style={{color: 'red'}}>An error occured while searching the song database</p>;
  }
});

module.exports = SearchSongs;

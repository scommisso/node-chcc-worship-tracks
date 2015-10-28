var React = require('react');
var map = require('lodash/collection/map');
var toParamCase = require('change-case').paramCase;
var Router = require('react-router');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var MusiciansStore = require('../stores/MusiciansStore');
var fetchMusicians = require('../actions/fetchMusicians');

var Link = Router.Link;
var Loading = require('./Loading.jsx');

var Musicians = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [MusiciansStore],

    fetchData: function(context, params, query, done) {
      context.executeAction(fetchMusicians, {}, done);
    }
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      musicians: this.getStore(MusiciansStore).getMusicians(),
      loading: this.getStore(MusiciansStore).isLoading()
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  render: function() {
    return (
      <div>
        {this.renderLoading()}
        <div>{this.renderData()}</div>
      </div>
    );
  },

  renderData: function() {
    var musicians = this.state.musicians;
    var musicianCount = musicians && musicians.length;
    return (
      <div className="row">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              <h1>Musicians <span className="badge badge-lg">{musicianCount}</span></h1>
            </h3>
          </div>
          <div className="panel-body">
            <ul className="list-group">{this.renderMusicians(musicians)}</ul>
          </div>
        </div>
      </div>
    );
  },

  renderMusicians: function(musicians) {
    return map(musicians, function(musician) {
      return (
        <li className="list-group-item" key={musician}>
          <Link to="musician-details" params={{musician: toParamCase(musician)}}>
            {musician}
          </Link>
        </li>
      );
    });
  },

  renderLoading: function() {
    if (!this.state.loading) {
      return null;
    }

    return <Loading />;
  }
});

module.exports = Musicians;

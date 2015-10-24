var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var CreateSongStore = require('../stores/CreateSongStore');

var NewSong = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [CreateSongStore]
  },

  getInitialState: function() {
    return this.getStateFromStores();
  },

  getStateFromStores: function () {
    return {
      isCreatingSong: this.getStore(CreateSongStore).isCreatingSong(),
      error: this.getStore(CreateSongStore).getCreateSongError()
    };
  },

  onChange: function() {
    this.setState(this.getStateFromStores());
  },

  render: function() {
    return (
      <div>
        <form action="/songs/create" onSubmit={this.handleCreateSong}>
          <p>
            <input ref="name" name="name" placeholder="New song" />
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
    var text = 'Create';

    if (this.state.isCreatingSong) {
      disabled = true;
      text = 'Creating...';
    }

    return (
      <button
        type="submit"
        disabled={disabled}>
        {text}
      </button>
    );
  },

  handleCreateSong: function(e) {
    e.preventDefault();
    var name = this.refs.name.getDOMNode().value.trim();
    if (!(name && name.length)) {
      return;
    }
    this.refs.name.getDOMNode().value = '';
    this.context.router.transitionTo('song-create', {}, {name: name});
  },

  renderError: function() {
    var error = this.state.error;
    if (!error) {
      return null;
    }

    return <p style={{color: 'red'}}>An error occured while creating song</p>;
  }
});

module.exports = NewSong;

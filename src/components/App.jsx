var React = require('react');
var Router = require('react-router/build/npm/lib');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <div>
        <p>
          <Link to="song-titles">Songs</Link> | <Link to="songs">Database</Link>
        </p>
        <RouteHandler />
      </div>
    );
  }
});

module.exports = App;

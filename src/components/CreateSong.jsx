var React = require('react');
var createSong = require('../actions/createSong');

var CreateSong = React.createClass({
  statics: {
    willTransitionTo: function(transition, params, query, cb) {
      transition.context.executeAction(createSong, query, function() {
        transition.redirect('/songs');
        cb();
      });
    }
  },

  render: function() {
    return null;
  }
});

module.exports = CreateSong;

var React = require('react/addons');

module.exports = React.createClass({

  render: function() {
    return (
      <audio controls>
        <source src={this.props.source} type="audio/mpeg" />
        <a href={this.props.source}>{this.props.title}</a>
      </audio>
    );
  }
});
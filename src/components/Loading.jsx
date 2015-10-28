var React = require('react');

var Loading = React.createClass({
  propTypes: {
    timeout: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      timeout: 250
    };
  },

  getInitialState: function() {
    return {loading: false};
  },

  componentDidMount: function() {
    var self = this;
    this.timeout = setTimeout(function() {
      self.setState({loading: true});
    }, this.props.timeout);
  },

  componentWillUnmount: function() {
    clearTimeout(this.timeout);
  },

  render: function() {
    if (!this.state.loading) {
      return null;
    }

    return (
      <div className="progress">
        <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
          <span className="sr-only">Loading</span>
        </div>
      </div>
    );
  }
});

module.exports = Loading;

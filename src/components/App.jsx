var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render: function() {
    var path = this.props.children.type.getCurrentPathname().trim().toLowerCase();
    var searchActive = path === '/search';
    var songTitlesActive = path === '/songtitles';
    var musiciansActive = path === '/musicians';
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="/">CHCC Worship Tracks</a>
            </div>
            <div id="navbar" className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <li className={searchActive ? 'active' : '' }><Link to="song-search">Search</Link></li>
                <li className={songTitlesActive ? 'active' : '' }><Link to="song-titles">Songs</Link></li>
                <li className={musiciansActive ? 'active' : '' }><Link to="musicians">Musicians</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container">
          <RouteHandler />
        </div>
        <footer className="footer">
          <div className="container">
            <p className="text-muted">Copyright &copy; 2015 Steve Commisso</p>
          </div>
        </footer>
      </div>
    );
  }
});

module.exports = App;

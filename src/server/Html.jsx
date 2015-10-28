var React = require('react');

var Html = React.createClass({
    propTypes: {
      markup: React.PropTypes.string,
      state: React.PropTypes.string,
      config: React.PropTypes.string
    },

    getDefaultProps: function() {
      return {
        markup: '',
        state: '',
        config: ''
      };
    },

    render: function() {
      var ieComment = '<!--[if lt IE 9]>' +
        '<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>' +
        '<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>' +
      '<![endif]-->';
      return (
        <html>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <title>CHCC Worship Tracks</title>
          <meta name="description" content="CHCC Worship Practice Tracks" />
          <meta name="author" content="Stephen Commisso, Coast Hills Community Church Worship Team" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css" integrity="sha384-aUGj/X2zp5rLCbBxumKTCw2Z50WgIr1vs/PFN4praOTvYXWlVyh2UtNUU0KAUhAX" crossOrigin="anonymous" />
          <link rel="stylesheet" href="/styles/site.css" />
          <meta name="react-comment-hack" dangerouslySetInnerHTML={{__html: ieComment}} />
        </head>
        <body role="document" cz-shortcut-listen="true">
          <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" integrity="sha512-K1qjQ+NcF2TYO/eI3M6v8EiNYZfA95pQumfvcVrTHtwQVDG+aHRqLi/ETn2uB+1JqwYqVG3LIvdm9lj6imS/pQ==" crossOrigin="anonymous" />
          <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
          <script dangerouslySetInnerHTML={{__html: this.props.config}}></script>
          <script src="/public/client.js" defer></script>
        </body>
        </html>
      );
    }
});

module.exports = Html;

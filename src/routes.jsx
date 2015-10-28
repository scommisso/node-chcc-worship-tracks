var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;

module.exports = (
  <Route path="/" handler={require('./components/App.jsx')}>
    <Route name="songs" handler={require('./components/SongList.jsx')}>
      <Route name="song-create" path="create" handler={require('./components/CreateSong.jsx')}/>
    </Route>
    <Route name="song-search" path="search" handler={require('./components/SongSearch.jsx')}/>
    <Route name="song-titles" path="songTitles" handler={require('./components/SongTitles.jsx')}/>
    <Route name="songs-by-title" path="songTitles/:title" handler={require('./components/SongsByTitle.jsx')}/>
    <Route name="song-details" path="songs/:id" handler={require('./components/SongDetails.jsx')}/>
    <Route name="musician-details" path="musician/:musician" handler={require('./components/MusicianDetails.jsx')}/>
    <Route name="musicians" path="musicians" handler={require('./components/Musicians.jsx')}/>
    <Redirect from="/" to="search" />
    <NotFoundRoute name="not-found" handler={require('./components/NotFound.jsx')}/>
  </Route>
);

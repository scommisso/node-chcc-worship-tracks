var Fluxible = require('fluxible');

var app = new Fluxible();

app.plug(require('./utils/apiPlugin'));
app.plug(require('./utils/routerPlugin')());

app.registerStore(require('./stores/SongStore'));
app.registerStore(require('./stores/SongSearchStore'));
app.registerStore(require('./stores/SongTitlesStore'));
app.registerStore(require('./stores/SongsByTitleStore'));
app.registerStore(require('./stores/SongsByMusicianStore'));
app.registerStore(require('./stores/PositionsByMusicianStore'));
app.registerStore(require('./stores/CreateSongStore'));

module.exports = app;

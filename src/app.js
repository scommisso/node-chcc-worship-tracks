var Fluxible = require('fluxible');

var app = new Fluxible();

app.plug(require('./utils/apiPlugin'));
app.plug(require('./utils/routerPlugin')());

app.registerStore(require('./stores/SongStore'));
app.registerStore(require('./stores/SongTitlesStore'));
app.registerStore(require('./stores/SongsByTitleStore'));
app.registerStore(require('./stores/CreateSongStore'));
app.registerStore(require('./stores/BandStore'));
app.registerStore(require('./stores/FetchBandStore'));

module.exports = app;

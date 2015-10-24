var debug = require('debug')('app:fetchSongsByTitle');

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch('FETCH_SONGS_BY_TITLE_START');
  context.api.getSong(payload.songTitle, function(err, songs) {
    if (err) {
      debug('Failed');
      context.dispatch('FETCH_SONGS_BY_TITLE_FAILURE', err);
      done();
      return;
    }
    debug('Success');
    songs.forEach(function (song) {
      context.dispatch('FETCH_SONG_SUCCESS', song);
    });
    context.dispatch('FETCH_SONGS_BY_TITLE_SUCCESS', songs);
    done();
  });
};

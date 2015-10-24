var debug = require('debug')('app:fetchSong');

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch('FETCH_SONG_START');
  context.api.getSong(payload.songId, function(err, songs) {
    if (err || !songs.length) {
      debug('Failed');
      context.dispatch('FETCH_SONG_FAILURE', err);
      done();
      return;
    }
    debug('Success');
    context.dispatch('FETCH_SONG_SUCCESS', songs[0]);
    done();
  });
};

var debug = require('debug')('app:fetchSongTitles');

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch('FETCH_SONG_TITLES_START');
  context.api.getSongTitles(function(err, songs) {
    if (err) {
      debug('Failed');
      context.dispatch('FETCH_SONG_TITLES_FAILURE', err);
      done();
      return;
    }
    debug('Success');
    context.dispatch('FETCH_SONG_TITLES_SUCCESS', songs);
    done();
  });
};

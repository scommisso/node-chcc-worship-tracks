var debug = require('debug')('app:fetchSongs');

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch('FETCH_SONGS_START');
  context.api.getSongs(function(err, songs) {
    if (err) {
      debug('Failed');
      context.dispatch('FETCH_SONGS_FAILURE', err);
      done();
      return;
    }
    debug('Success');
    context.dispatch('FETCH_SONGS_SUCCESS', songs);
    done();
  });
};

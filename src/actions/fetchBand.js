var debug = require('debug')('app:fetchBand');

module.exports = function(context, payload, done) {
  debug('Started');
  var songId = payload.songId;
  context.dispatch('FETCH_BAND_START');
  context.api.getBand(songId, function(err, band) {
    if (err) {
      debug('Failed');
      context.dispatch('FETCH_BAND_FAILURE', err);
      done();
      return;
    }
    debug('Success');
    context.dispatch('FETCH_BAND_SUCCESS', {
      songId: songId,
      band: band
    });
    done();
  });
};

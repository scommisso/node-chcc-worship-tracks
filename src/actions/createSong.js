var debug = require('debug')('app:createSong');

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch('CREATE_SONG_START');
  context.api.createContact(payload, function(err, contact) {
    if (err) {
      debug('Failed');
      context.dispatch('CREATE_SONG_FAILURE', err);
      done();
      return;
    }
    debug('Success');
    context.dispatch('CREATE_SONG_SUCCESS', contact);
    done();
  });
};

'use strict';

var debug = require('debug')('app:fetchSong');
var actions = require('../constants').ACTION.SONG;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.FETCH_START);
  context.api.getSong(payload.songId, function(err, songs) {
    if (err || !songs.length) {
      debug('Failed');
      context.dispatch(actions.FETCH_FAILURE, err);
      done();
      return;
    }
    debug('Success');
    context.dispatch(actions.FETCH_SUCCESS, songs[0]);
    done();
  });
};

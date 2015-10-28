'use strict';

var debug = require('debug')('app:fetchMusicianName');
var actions = require('../constants').ACTION.MUSICIAN;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.FETCH_START);
  context.api.getFormattedMusicianName(payload.musicianSlug, function(err, songs) {
    if (err) {
      debug('Failed');
      context.dispatch(actions.FETCH_FAILURE, err);
      done();
      return;
    }
    debug('Success');
    context.dispatch(actions.FETCH_SUCCESS, songs);
    done();
  });
};

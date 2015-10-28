'use strict';

var debug = require('debug')('app:fetchSongTitle');
var actions = require('../constants').ACTION.SONG_TITLES;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.FETCH_TITLE_START);
  context.api.getFormattedSongTitle(payload.titleSlug, function(err, title) {
    if (err) {
      debug('Failed');
      context.dispatch(actions.FETCH_TITLE_FAILURE, err);
      done();
      return;
    }
    debug('Success');
    context.dispatch(actions.FETCH_TITLE_SUCCESS, title);
    done();
  });
};

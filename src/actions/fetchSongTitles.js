'use strict';

var debug = require('debug')('app:fetchSongTitles');
var actions = require('../constants').ACTION.SONG_TITLES;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.FETCH_START);
  context.api.getSongTitles(function(err, songTitles) {
    if (err) {
      debug('Failed');
      context.dispatch(actions.FETCH_FAILURE, err);
      done();
      return;
    }
    debug('Success');
    context.dispatch(actions.FETCH_SUCCESS, songTitles);
    done();
  });
};

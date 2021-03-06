'use strict';

var debug = require('debug')('app:fetchSongs');
var actions = require('../constants').ACTION.SONGS;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.FETCH_START);
  context.api.getSongs(function(err, songs) {
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

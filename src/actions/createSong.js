'use strict';

var debug = require('debug')('app:createSong');
var actions = require('../constants').ACTION.SONG;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.CREATE_START);
  context.api.createContact(payload, function(err, newSong) {
    if (err) {
      debug('Failed');
      context.dispatch(actions.CREATE_FAILURE, err);
      done();
      return;
    }
    debug('Success');
    context.dispatch(actions.CREATE_SUCCESS, newSong);
    done();
  });
};

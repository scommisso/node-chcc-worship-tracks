'use strict';

var debug = require('debug')('app:fetchMusicians');
var actions = require('../constants').ACTION.MUSICIANS;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.FETCH_START);
  context.api.getMusicians(function(err, musicians) {
    if (err) {
      debug('Failed');
      context.dispatch(actions.FETCH_FAILURE, err);
      done();
      return;
    }
    debug('Success');
    context.dispatch(actions.FETCH_SUCCESS, musicians);
    done();
  });
};

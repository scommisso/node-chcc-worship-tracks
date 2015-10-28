'use strict';

var debug = require('debug')('app:fetchPositionsByMusician');
var actions = require('../constants').ACTION.POSITIONS_BY_MUSICIAN;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.FETCH_START);
  context.api.getPositionsByMusician(payload.musician, function(err, songs) {
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

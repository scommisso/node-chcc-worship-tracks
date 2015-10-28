'use strict';

var debug = require('debug')('app:setSearchCriteria');
var actions = require('../constants').ACTION.SEARCH;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.CHANGED, {
    query: payload.query,
    exact: payload.exact,
    limit: payload.limit
  });
  done();
};

var concurrent = require('contra').concurrent;
var filter = require('lodash/collection/filter');
var reduce = require('lodash/collection/reduce');

function fetchData(context, routerState, cb) {
  cb = cb || function noop() {};
  var fetchDataRoutes = filter(routerState.routes, function(route) {
    return route.handler.fetchData;
  });
  if (fetchDataRoutes.length === 0) {
    return cb();
  }

  var dataFetchers = reduce(fetchDataRoutes, function(result, route) {
    var fetcher = route.handler.fetchData
      .bind(null, context, routerState.params, routerState.query);
    result[route.name] = fetcher;
    return result;
  }, {});

  concurrent(dataFetchers, cb);
}

module.exports = fetchData;

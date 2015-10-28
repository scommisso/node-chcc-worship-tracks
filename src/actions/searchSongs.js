'use strict';

var debug = require('debug')('app:searchSongs');
var actions = require('../constants').ACTION.SONG_SEARCH;
var songActions = require('../constants').ACTION.SONG;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.SEARCH_START);
  context.api.searchSongs(payload.query, payload.exact, payload.limit, function(err, searchResults) {
    if (err) {
      debug('Failed');
      context.dispatch(actions.SEARCH_FAILURE, err);
      done();
      return;
    }
    debug('Success');
    (searchResults.full || []).forEach(function (song) {
      context.dispatch(songActions.FETCH_SUCCESS, song);
    });
    (searchResults.partial || []).forEach(function (song) {
      context.dispatch(songActions.FETCH_SUCCESS, song);
    });
    context.dispatch(actions.SEARCH_SUCCESS, searchResults);
    done();
  });
};

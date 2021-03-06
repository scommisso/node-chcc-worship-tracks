'use strict';

var debug = require('debug')('app:fetchSongsByTitle');
var actions = require('../constants').ACTION.SONGS_BY_TITLE;
var songActions = require('../constants').ACTION.SONG;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.FETCH_START);
  context.api.getSong(payload.songTitle, function(err, songs) {
    if (err) {
      debug('Failed');
      context.dispatch(actions.FETCH_FAILURE, err);
      done();
      return;
    }
    debug('Success');
    songs.forEach(function (song) {
      context.dispatch(songActions.FETCH_SUCCESS, song);
    });
    context.dispatch(actions.FETCH_SUCCESS, songs);
    done();
  });
};

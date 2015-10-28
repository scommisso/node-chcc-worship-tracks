'use strict';

var debug = require('debug')('app:fetchSongsByMusician');
var actions = require('../constants').ACTION.SONGS_BY_MUSICIAN;
var songActions = require('../constants').ACTION.SONG;

module.exports = function(context, payload, done) {
  debug('Started');
  context.dispatch(actions.FETCH_START);
  context.api.getSongsByMusician(payload.musician, function(err, songs) {
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

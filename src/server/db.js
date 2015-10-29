'use strict';

var Immutable = require('immutable');
var uniq = require('lodash.uniq');
var filter = require('lodash.filter');
var toParamCase = require('change-case').paramCase;
var nameParser = require('another-name-parser');
var structuredData = require('./data/structuredData');
var Search = require('./search.js');

var lastId = 0;
Object.keys(structuredData.songsById).forEach(function (songId) {
  songId = parseInt(songId);
  if (songId > lastId) { lastId = songId };
});

var makeId = function makeId() {
  return (lastId += 1);
}

var db = {};
db._state = Immutable.fromJS(structuredData);
db._search = new Search(structuredData.searchIndex);

db.searchSongs = function (searchString, exact, max) {
  if (typeof exact === 'number') {
    max = exact;
    exact = false;
  }
  if (!max) { max = 9999999; }

  var matches = db._search.search(searchString, ['title', 'bandMember', 'style'], exact);
  var full = uniq(filter(matches, function (hit) { return hit.score >= 1; })
    .map(function (hit) { return hit.id; }));
  var partial = uniq(filter(matches, function (hit) { return !~full.indexOf(hit.id); })
    .map(function (hit) { return hit.id; }));

  full = full.slice(0, max);
  max = max - full.length;
  partial = partial.slice(0, max);

  full = full.map(db.getSong.bind(db));
  partial = partial.map(db.getSong.bind(db));

  return {
    full: new Immutable.List(full),
    partial: new Immutable.List(partial)
  };
};

db.createSong = function() {
  var token = makeId();
  this._state = this._state.setIn(['songsById', token], true);
  return token;
};

db.getSongs = function() {
  return this._state.get('songsById')
    .toList();
};

db.getSongTitles = function() {
  var self = this;
  return this._state.get('songsByTitle')
    .keySeq()
    .sort()
    .map(function (title) { return self._state.get('songsByTitle').get(title).get(0).get('title'); })
    .toList();
};

db.getSongsByTitle = function(titleSlug) {
  var songs = this._state.getIn(['songsByTitle', titleSlug]);
  if (!songs) {
    return new Immutable.List();
  }
  return songs;
};

db.getFormattedSongTitle = function(titleSlug) {
  var songs = this._state.getIn(['songsByTitle', titleSlug]);
  if (!songs || !songs.size) {
    return title;
  }
  return songs.get(0).get('title');
};

db.getSongsByMusician = function(musicianSlug) {
  var songs = this._state.getIn(['songsByMusician', musicianSlug]);
  if (!songs) {
    return new Immutable.List();
  }
  return songs;
};

db.getPositionsByMusician = function(musicianSlug) {
  var positions = this._state.getIn(['positionsByMusician', musicianSlug]);
  if (!positions) {
    return new Immutable.List();
  }
  return positions;
};

db.getFormattedMusicianName = function(musicianSlug) {
  var positions = this._state.getIn(['bandMembersByName', musicianSlug]);
  if (!positions || !positions.size) {
    return musicianSlug
  }
  return positions.get(0).get('name');
};

db.getSongStyles = function() {
  return this._state.get('styles')
    .toList();
};

db.getPlans = function() {
  return this._state.get('songsByPlan')
    .keySeq()
    .sort()
    .toList();
};

db.getMusicians = function() {
  var self = this;
  return this._state.get('bandMembersByName')
    .keySeq()
    .map(function (title) {
      var fullName = self._state.get('bandMembersByName').get(title).get(0).get('name');
      var parsed = nameParser(fullName);
      var last = parsed.last && parsed.last.trim().toLowerCase();
      var first = parsed.first && parsed.first.trim().toLowerCase();
      if (!last && first) {
        last = first;
        first = '';
      }
      return {
        full: fullName,
        last: last,
        first: first
      };
    })
    .sort(function (a, b) {
      if (a.last === b.last) {
        if (a.first === b.first) { return 0; }
        return a.first < b.first ? -1 : 1;
      }
      return a.last < b.last ? -1 : 1;
    })
    .map(function (n) { return n.full; })
    .toList();
};

db.getPositions = function() {
  return this._state.get('bandMembersByPosition')
    .keySeq()
    .sort()
    .toList();
};

db.addSong = function(song) {
  var id = makeId();
  song = song.merge(Immutable.fromJS({
    id: id,
    band: [],
    planningCenter: {}
  }));
  this._state = this._state.setIn(['songsById', id], song);
  // TODO: Update other dictionaries
  return song;
};

db.getSong = function(id) {
  var song = this._state.getIn(['songsById', id]);
  if (!song) {
    return null;
  }
  return song;
};

db.updateSong = function(id, updates) {
  var song = this._state.getIn(['songsById', id]);
  if (!song) {
    return null;
  }
  song = song.merge(updates);
  this._state = this._state.setIn(['songsById', id], song);
  // TODO: Update other dictionaries
  return song;
};

db.updateSong = function(id) {
  if (!this._state.getIn(['songsById', id])) {
    return null;
  }
  this._state = this._state.removeIn(['songsById', id]);
  // TODO: Update other dictionaries
  return true;
};

db.getBandForSong = function(songId) {
  var song = this._state.getIn(['songsById', songId]);
  if (!song) {
    return null;
  }
  return song.get('band');
};

db.addBandMemberForSong = function(songId, member) {
  this._state = this._state.updateIn(['songsById', songId, 'band'],
    function(bandMembers) {
      return bandMembers.push(member);
    });
  // TODO: Update other dictionaries
};

module.exports = db;

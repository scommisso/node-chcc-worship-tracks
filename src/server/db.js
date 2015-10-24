var Immutable = require('immutable');
var structuredData = require('./data/structuredData');

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
  return this._state.get('songsByTitle')
    .keySeq()
    .sort()
    .toList();
};

db.getSongsByTitle = function(title) {
  var songs = this._state.getIn(['songsByTitle', title]);
  if (!songs) {
    return new Immutable.List();
  }
  return songs;
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
  return this._state.get('bandMembersByName')
    .keySeq()
    .sort()
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

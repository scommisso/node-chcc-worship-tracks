'use strict';

var clone = require('clone');
var toLower = require('change-case').lower;
var toParamCase = require('change-case').paramCase;
var fs = require('fs');
var path = require('path');

var songsJson = fs.readFileSync(path.join(__dirname, 'songs.json'));

var songs = JSON.parse(songsJson);
var songsById = {};
var songsByTitle = {};
var songsByMember = {};
var bandMembersByPosition = {};
var bandMembersByName = {};
var positionsByBandMember = {};
var songsByPlan = {};
var styles = [];

var id = 0;
songs.sort(songsByTitleAndDate);
songs.forEach(function (song) {
  song.id = (id += 1);
  songsById[song.id] = song;
  addToDictionaryList(songsByTitle, toParamCase(song.title), song);
  addToDictionaryList(songsByPlan, parsePlan(song.planningCenter && song.planningCenter.plan), song);

  if (Array.isArray(song.band)) {
    song.band.forEach(function (member) {
      addToDictionarySet(bandMembersByPosition, toParamCase(member.position.trim()), member.name);
      addToDictionarySet(bandMembersByName, toParamCase(member.name.trim()), member);
      addToDictionarySet(positionsByBandMember, toParamCase(member.name.trim()), member.position);
      addToDictionarySet(songsByMember, toParamCase(member.name.trim()), song);
    });
  }

  if (song.style && !containsValue(styles, song.style)) {
    styles.push(song.style);
  }
});
styles.sort();

function parsePlan(planUrl) {
  if (!planUrl) { return null; }
  var ix = planUrl.lastIndexOf('/');
  if (ix === -1) { return planUrl; }
  return planUrl.substring(ix + 1);
}

function addToDictionaryList(map, identifier, object) {
  if (!identifier) { return; }
  if (!map[identifier]) { map[identifier] = []; }
  map[identifier].push(object);
}

function addToDictionarySet(map, identifier, object) {
  if (!identifier) { return; }
  if (!map[identifier]) { map[identifier] = []; }
  if (!containsValue(map[identifier], object)) {
    map[identifier].push(object);
  }
}

function containsValue(array, value) {
  return (array.filter(function (v) { return v == value; }).length > 0);
}

function songsByTitleAndDate(a, b) {
  var date1 = new Date(a.date);
  var date2 = new Date(b.date);
  if (date1 == date2) {
    var title1 = a.title.toLowerCase();
    var title2 = b.title.toLowerCase();
    if (title1 < title2) { return -1 }
    if (title1 == title2) { return 0; }
    return 1;
  }
  return date1 > date2 ? -1 : 1;
}

function buildSearchIndex(songs) {
  var songSearch = [];
  songs.forEach(function (song) {
    var s = clone(song);
    if (song.planningCenter) {
      if (song.planningCenter.plan) { s.planningCenterPlan = s.planningCenter.plan; }
      if (song.planningCenter.arrangement) { s.planningCenterArrangement = s.planningCenter.arrangement; }
      delete s.planningCenter;
    }
    if (song.band) {
      var band = song.band;
      delete s.band;
      band.forEach(function (member) {
        var sBand = clone(s);
        sBand.bandMember = member.name;
        sBand.bandPosition = member.position;
        songSearch.push(objectLowerCase(sBand));
      });
    } else {
      songSearch.push(objectLowerCase(s));
    }
  });
  return songSearch;
}

function objectLowerCase(value) {
  Object.keys(value).forEach(function (k) {
    value[k] = toLower(value[k]);
  });
  return value;
}

module.exports = {
  songsById: songsById,
  songsByPlan: songsByPlan,
  songsByTitle: songsByTitle,
  songsByMusician: songsByMember,
  positionsByMusician: positionsByBandMember,
  styles: styles,
  bandMembersByPosition: bandMembersByPosition,
  bandMembersByName: bandMembersByName,
  searchIndex: buildSearchIndex(songs)
};

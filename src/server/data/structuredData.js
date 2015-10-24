'use strict';

var fs = require('fs');
var path = require('path');

var songsJson = fs.readFileSync(path.join(__dirname, 'songs.json'));

var songs = JSON.parse(songsJson);
var songsById = {};
var songsByTitle = {};
var songsByMember = {};
var bandMembersByPosition = {};
var bandMembersByName = {};
var songsByPlan = {};
var styles = [];

var id = 0;
songs.sort(songsByTitleAndDate);
songs.forEach(function (song) {
  song.id = (id += 1);
  songsById[song.id] = song;
  addToDictionaryList(songsByTitle, song.title, song);
  addToDictionaryList(songsByPlan, parsePlan(song.planningCenter && song.planningCenter.plan), song);

  if (Array.isArray(song.band)) {
    song.band.forEach(function (member) {
      addToDictionarySet(bandMembersByPosition, member.position, member.name);
      addToDictionarySet(bandMembersByName, member.name, member.position);
      addToDictionarySet(songsByMember, member.name, song);
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

module.exports = {
  songsById: songsById,
  songsByPlan: songsByPlan,
  songsByTitle: songsByTitle,
  songsByMemberName: songsByMember,
  styles: styles,
  bandMembersByPosition: bandMembersByPosition,
  bandMembersByName: bandMembersByName
};

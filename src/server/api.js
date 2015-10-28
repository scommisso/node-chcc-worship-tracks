var Immutable = require('immutable');
var express = require('express');
var db = require('./db');

var api = express.Router();

api.get('/songs', function(req, res) {
  var query = req.query || {};
  var search = query.search;
  var exact = query.exact;
  var limit = query.limit;
  if (search) {
    res.json(db.searchSongs(search, exact, limit));
  } else {
    res.json(db.getSongs());
  }
});

api.get('/songTitles', function(req, res) {
  res.json(db.getSongTitles());
});

api.get('/plans', function(req, res) {
  res.json(db.getPlans());
});

api.get('/styles', function(req, res) {
  res.json(db.getSongStyles());
});

api.get('/musicians', function(req, res) {
  res.json(db.getMusicians());
});

api.get('/musicians/:musician/songs', function(req, res) {
  res.json(db.getSongsByMusician(req.params.musician));
});

api.get('/musicians/:musician/name', function(req, res) {
  res.json(db.getFormattedMusicianName(req.params.musician));
});

api.get('/musicians/:musician/positions', function(req, res) {
  res.json(db.getPositionsByMusician(req.params.musician));
});

api.get('/positions', function(req, res) {
  res.json(db.getPositions());
});

api.post('/songs', function(req, res) {
  var song = Immutable.fromJS(req.body);
  song = db.addSong(song);
  res.status(201).json(song);
});

api.get('/songs/:id', function(req, res) {
  var id = req.params.id;
  if (isNumeric(id)) {
    var song = db.getSong(id);
    if (song) { songs = new Immutable.List([song]); }
  } else {
    songs = db.getSongsByTitle(id);
  }
  if (!songs.size) {
    return res.status(404).json(songNotFoundResponse());
  }
  return res.json(songs);
});

api.get('/songs/:title/name', function(req, res) {
  res.json(db.getFormattedSongTitle(req.params.title));
});

api.put('/songs/:id', function(req, res) {
  var id = req.params.id;
  var updates = Immutable.fromJS(req.body);
  var song = db.updateSong(id, updates);
  if (!song) {
    return res.status(404).json(songNotFoundResponse());
  }
  return res.json(song);
});

api.delete('/songs/:id', function(req, res) {
  var id = req.params.id;
  var song = db.deleteSong(id);
  if (!song) {
    return res.status(404).json(songNotFoundResponse());
  }
  return res.sendStatus(200);
});

api.get('/songs/:id/band', function(req, res) {
  var songId = req.params.id;
  var band = db.getBandForSong(songId);
  if (!band) {
    return res.status(404).json(songNotFoundResponse());
  }
  res.json(band);
});

api.post('/songs/:id/band', function(req, res) {
  var songId = req.params.id;
  var member = Immutable.fromJS(req.body);
  member = db.addBandMemberForSong(songId, member);
  if (!member) {
    return res.status(404).json(songNotFoundResponse());
  }
  return res.json(member);
});

api.all('*', function(req, res) {
  return res.status(400).json({
    error: {
      name: 'BadUrl',
      message: 'No endpoint for given URL'
    }
  });
});

var numericRe = /^\d+$/;
function isNumeric(value) {
  return numericRe.test(value);
}

function songNotFoundResponse() {
  return { message: 'Song Not Found', code: 404 };
}

module.exports = api;

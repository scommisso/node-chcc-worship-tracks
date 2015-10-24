var superagent = require('superagent');
var debug = require('debug')('app:Api');

function Api(options) {
  options = options || {};
  var noop = function() {};

  this._getHost = options.getHost || noop;
}

Api.prototype.getMusicians = function(cb) {
  superagent
    .get(this._getHost() + '/musicians')
    .accept('json')
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && res.body);
    });
};

Api.prototype.getPlans = function(cb) {
  superagent
    .get(this._getHost() + '/plans')
    .accept('json')
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && res.body);
    });
};

Api.prototype.getStyles = function(cb) {
  superagent
    .get(this._getHost() + '/styles')
    .accept('json')
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && res.body);
    });
};

Api.prototype.getPositions = function(cb) {
  superagent
    .get(this._getHost() + '/positions')
    .accept('json')
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && res.body);
    });
};

Api.prototype.getSongs = function(cb) {
  superagent
    .get(this._getHost() + '/songs')
    .accept('json')
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && res.body);
    });
};

Api.prototype.getSong = function(id, cb) {
  superagent
    .get(this._getHost() + '/songs/' + id)
    .accept('json')
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && res.body);
    });
};

Api.prototype.getSongTitles = function(cb) {
  superagent
    .get(this._getHost() + '/songTitles')
    .accept('json')
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && res.body);
    });
};

Api.prototype.createSong = function(song, cb) {
  superagent
    .post(this._getHost() + '/songs')
    .accept('json')
    .send(song)
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && res.body);
    });
};

Api.prototype.getBand = function(songId, cb) {
  superagent
    .get(this._getHost() + '/songs/' + songId + '/band')
    .accept('json')
    .end(function(err, res) {
      if (err) {
        debug('error', err);
      }
      cb(err, res && res.body);
    });
};

module.exports = Api;

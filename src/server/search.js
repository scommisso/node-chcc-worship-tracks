'use strict';

var sortByOrder = require('lodash.sortbyorder');

function Search(database) {
  this.db = database || [];
};

var tokenizer = /\w+/g;
Search.prototype.search = function search(value, fields, exact) {
  var value = value.toLowerCase();
  if (typeof fields === 'boolean') {
    exact = fields;
    fields = '*';
  }
  var values = exact ? [value] : value.match(tokenizer);
  fields = fields || '*';
  var matches = [];
  this.db.forEach(function (record) {
    var hits = 0;
    var searchFields = fields === '*' ? Object.keys(record) : fields;
    for(var i = 0; i < searchFields.length; i++) {
      for (var j = 0; j < values.length; j++) {
        if (doesValueMatch(record[searchFields[i]], values[j], exact)) {
          hits += 1;
        }
      }
    }
    if (hits) {
      matches.push({
        id: record.id,
        score: hits / values.length
      });
    }
  });
  return sortByOrder(matches, ['score', 'date'], ['desc', 'desc']);
};

function doesValueMatch(value, expectedValue, exact) {
  if (typeof value !== 'string') { return false; }
  if (exact) { return value === expectedValue; }
  return (new RegExp(expectedValue)).test(value);
}

module.exports = Search;

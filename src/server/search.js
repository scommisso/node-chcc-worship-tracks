'use strict';

var sortByOrder = require('lodash.sortbyorder');

function Search(database) {
  this.db = database || [];
};

Search.prototype.search = function search(value, fields, exact) {
  var value = value.toLowerCase();
  if (typeof fields === 'boolean') {
    exact = fields;
    fields = '*';
  }
  var values = exact ? [value] : tokenize(value);
  fields = fields || '*';
  var matches = [];
  this.db.forEach(function (record) {
    var hits = 0;
    var searchFields = fields === '*' ? Object.keys(record) : fields;
    for(var i = 0; i < searchFields.length; i++) {
      var searchField = searchFields[i];
      for (var j = 0; j < values.length; j++) {
        if (!Array.isArray(values[j])) {
          values[j] = splitFieldValue(values[j]);
        }
        var searchValues = values[j];
        var searchValue = searchValues[1] || searchValues[0];
        if (searchValues.length > 1 && searchField === 'bandMember') {
          if (doesValueMatch(record.bandPosition, searchValues[0], exact)
            && doesValueMatch(record.bandMember, searchValue, exact)) {
            hits += 1;
          }
        }
        else if (doesValueMatch(record[searchField], searchValue, exact)) {
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

var colonTokenizer = /[\w\s]+/g;
function splitFieldValue(value) {
  var splitValues = value.match(colonTokenizer)
      .filter(function (v) { return !!v; })
      .map(function (v) { return v.trim(); });
  return splitValues;
}


function tokenize(value) {
  var value = value.toLowerCase();
  var tokens = [];
  var currToken = '';
  var inQuotes = false;
  var sawColon = false;
  for (var i = 0; i < value.length; i++) {
    if (value[i] === '"') {
      if (inQuotes = true) {
        inQuotes = false;
        if (currToken.length) {
          tokens.push(currToken);
        }
        currToken = '';
      } else {
        inQuotes = true;
      }
    } else if (value[i] === ':') {
      sawColon = true;
      currToken += value[i];
    } else if (inQuotes || isAlphanumeric(value[i])) {
      currToken += value[i];
      sawColon = false;
    } else if (!sawColon) {
      if (currToken.length) {
        tokens.push(currToken);
      }
      currToken = '';
    }
  }
  return tokens;
}

function isAlphanumeric(character) {
  var code = character.charCodeAt(0);
  return (code >= 97 && code <= 122)
    || (code >= 48 && code <= 57);
}

function doesValueMatch(value, expectedValue, exact) {
  if (typeof value !== 'string') { return false; }
  if (exact) { return value === expectedValue; }
  var matchRe = new RegExp('[^\\s]*' + escapeRegexString(expectedValue));
  return matchRe.test(value);
}

function escapeRegexString(value) {
  return (value + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
}

module.exports = Search;

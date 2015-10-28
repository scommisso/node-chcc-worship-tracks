'use strict';

module.exports = function getHandlers(actionsAndHandlers) {
  var handlers = {};
  (actionsAndHandlers || []).forEach(function (actionAndHandler) {
    handlers[actionAndHandler[0]] = actionAndHandler[1];
  });
  return handlers;
};

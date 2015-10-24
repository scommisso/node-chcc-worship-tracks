var Api = require('../Api');

module.exports = {
  name: 'ApiPlugin',

  plugContext: function(options) {
    var apiHost = options.config && options.config.API_HOST;

    return {
      plugActionContext: function(actionContext) {
        actionContext.api = new Api({
          getHost: function() {
            return apiHost;
          }
        });
      },

      dehydrate: function() {
        return {
          apiHost: apiHost
        };
      },

      rehydrate: function(state) {
        apiHost = state.apiHost;
      }
    };
  }
};

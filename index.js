var _ = require('lodash');

var defaults = {
  endpoint: '/',
  path: '',
  cache: false,
  host: '',
  version: false,
  browserCache: {
    privacy: 'public',
    expiresIn: 0
  }
};

exports.register = function(server, options, next) {

  options = _.defaults(options, defaults);
  var plugin = {
    server: server,
    options: options,
    extensions: {}
  };

  var addExtension = function(extension, pipeline, options) {
    if (plugin.extensions[extension]) {
      throw new Error(extension + ' extension already exists');
    }
    if (typeof pipeline === 'function') {
      pipeline = [pipeline];
    }
    plugin.extensions[extension] = {
      options: options || {},
      pipeline: pipeline
    };
  };

  server.expose('getAsset', require('./helpers/asset').bind(plugin));
  server.expose('addExtension', addExtension);

  require('./lib/handler')(server, plugin);

  _.forIn(options.extensions, function(value, key) {
    addExtension(key, value.pipeline, value.options);
  });

  next();

};

exports.register.attributes = {
  name: 'pipeline',
  pkg: require('./package.json')
};

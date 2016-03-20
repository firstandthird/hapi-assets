const _ = require('lodash');

const defaults = {
  assetPath: '/',
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
  options = _.defaultsDeep(options, defaults);
  const plugin = {
    server,
    options,
    extensions: {}
  };


  const pipeline = require('./lib/pipeline')(options);
  server.expose('pipeline', pipeline);
  server.expose('getAsset', require('./helpers/asset').bind(plugin));

  require('./lib/handler')(server, plugin);

  next();
};

exports.register.attributes = {
  name: 'pipeline',
  pkg: require('./package.json')
};

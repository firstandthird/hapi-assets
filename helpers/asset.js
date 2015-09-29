var path = require('path');
var url = require('url');
module.exports = function(assetPath, version, options) {

  if (typeof version == 'object') {
    options = version;
    version = null;
  }

  var plugin = this;

  var fullPath = path.join(plugin.options.endpoint, assetPath);

  var urlPath = url.resolve(plugin.options.host, fullPath);

  version = version || plugin.options.version;

  if (version) {
    urlPath += '?v=' + version;
  }

  return urlPath;

};

var path = require('path');
var url = require('url');
module.exports = function(assetPath) {

  var plugin = this;

  var fullPath = path.join(plugin.options.endpoint, assetPath);

  var urlPath = url.resolve(plugin.options.host, fullPath);

  if (plugin.options.version) {
    urlPath += '?v=' + plugin.options.version;
  }

  return urlPath;

};

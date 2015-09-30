var path = require('path');
var processExtension = require('./process');
var serveStatic = require('./static');


module.exports = function(server, plugin) {

  var assetCache = server.cache({
    segment: 'pipeline',
    expiresIn: (plugin.options.cache) ? 1000 * 60 * 60 * 24 * 15 : 1,
    generateFunc: function(id, next) {

      var start = +new Date();
      var extension = plugin.extensions[id.fileExtension];
      processExtension(extension, id.filepath, function(err, contents) {
        if (err) {
          server.log(['pipeline', 'error'], { message: 'error processing file', extension: id.fileExtension, filepath: id.filepath, error: err });
          return next(err);
        }
        var diff = +new Date() - start;
        server.log(['pipeline', 'info'], { message: 'processed file', time: diff, extension: id.fileExtension, filepath: id.filepath });
        next(null, contents);

      });

    },
    generateTimeout: 5000

  });

  server.expose('cache', assetCache);

  //route
  server.route({
    method: 'get',
    path: plugin.options.endpoint + '/{path*}',
    config: {
      cache: plugin.options.browserCache
    },
    handler: function(request, reply) {

      var file = request.params.path;

      if (!file) {
        return reply('Not Found').code(404);
      }

      var ext = path.extname(file);
      var filepath = path.join(plugin.options.path, file);

      var extension = plugin.extensions[ext];

      if (!extension) {
        return serveStatic(filepath, request, reply);
      }

      assetCache.get({ id: filepath, fileExtension: ext, filepath: filepath }, function(err, result) {
        if (err) {
          return reply(err);
        }
        var r = reply(result);
        if (extension.options.contentType) {
          r.type(extension.options.contentType);
        }
      });


    }
  });

};

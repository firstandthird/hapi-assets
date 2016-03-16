const path = require('path');
const serveStatic = require('./static');


module.exports = function(server, plugin) {
  const assetCache = server.cache({
    segment: 'pipeline',
    expiresIn: (plugin.options.cache) ? 1000 * 60 * 60 * 24 * 15 : 1,
    generateFunc(id, next) {
      const filepath = id.id;
      const start = +new Date();
      server.plugins.pipeline.pipeline.process(filepath, (err, fileObj) => {
        if (err) {
          server.log(['pipeline', 'error'], { message: 'error processing file', filepath: filepath, error: err });
          return next(err);
        }
        const diff = +new Date() - start;
        server.log(['pipeline', 'info'], { message: 'processed file', time: diff, filepath: filepath });
        next(null, fileObj);
      });
    },
    generateTimeout: 5000
  });

  server.expose('cache', assetCache);

  //route
  server.route({
    method: 'get',
    path: `${plugin.options.endpoint}/{path*}`,
    config: {
      cache: plugin.options.browserCache
    },
    handler(request, reply) {
      const file = request.params.path;

      if (!file) {
        return reply('Not Found').code(404);
      }

      const filepath = path.join(plugin.options.path, file);
      const ext = path.extname(file);

      if (!server.plugins.pipeline.pipeline.hasExtension(ext)) {
        return serveStatic(filepath, request, reply);
      }

      assetCache.get({ id: filepath }, (err, fileObj) => {
        if (err) {
          return reply(err);
        }
        const r = reply(fileObj.contents);
        if (fileObj.mime) {
          r.type(fileObj.mime);
        }
      });
    }
  });
};

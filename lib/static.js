var inertFile = require('inert/lib/file');
module.exports = function(path, request, reply) {

  //HACK
  if (!request.server.plugins.inert) {
    request.server.plugins.inert = { _etags: false };
  }
  return reply(inertFile.response(path, {}, request));

};

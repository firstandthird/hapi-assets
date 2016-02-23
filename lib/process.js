var fs = require('fs');
var _ = require('lodash');
var async = require('async');

module.exports = function(extension, filepath, done) {

  var extensions = _.clone(extension.pipeline);
  var output = '';

  //read file first
  extensions.unshift(function(filepath, contents, options, done) {

    fs.exists(filepath, function(exists) {
      if (!exists) {
        return done(new Error(filepath + ' doesn\'t exist'));
      }
      fs.readFile(filepath, 'utf8', function(err, contents) {
        if (err) {
          return done(err);
        }
        return done(null, contents);
      });
    });
  });

  async.eachSeries(extensions, function(extension, done) {

    var fn = (typeof extension === 'function' || typeof extension === 'string') ? extension : extension.process;
    var options = extension.options || {};

    if (typeof fn === 'object' && fn.package && fn.module) {
      fn = _.get(require(fn.package), fn.module);
    }
    if (typeof fn === 'string') {
      fn = require(fn);
    }
    if (typeof fn !== 'function') {
      return done(new Error('not a valid extension'));
    }

    fn(filepath, output, options, function(err, contents) {
      if (err) {
        return done(err);
      }
      output = contents;
      done();
    });

  }, function(err) {
    done(err, output);
  });

};

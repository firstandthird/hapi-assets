var fs = require('fs');
var _ = require('lodash');
var async = require('async');

module.exports = function(extension, filepath, done) {

  var extensions = _.map(extension.fns, function(e) {
    return e.bind(extension);
  });

  //read file first
  extensions.unshift(function(done) {

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

  async.waterfall(extensions, function(err, contents) {
    if (err) {
      return done(err);
    }
    done(null, contents);
  });

};

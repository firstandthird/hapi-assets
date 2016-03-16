'use strict';
const DefaultPipeline = require('pipeline').DefaultPipeline;
module.exports = function(options) {
  const pipeline = new DefaultPipeline(options);

  return pipeline;
};

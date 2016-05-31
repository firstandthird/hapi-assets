'use strict';
const DefaultPipeline = require('ft-pipeline').DefaultPipeline;
module.exports = function(options) {
  const pipeline = new DefaultPipeline(options);

  return pipeline;
};

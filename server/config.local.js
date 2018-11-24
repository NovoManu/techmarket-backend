'use strict';

const p = require('../package.json');
const version = p.version.split('.').shift();

module.exports = {
  restApiRoot: '/api' + (version > 0 ? '/v' + version : ''),
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3001,
};

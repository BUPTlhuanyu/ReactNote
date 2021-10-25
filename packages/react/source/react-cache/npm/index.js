'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-cache.production.min.js');
} else {
  module.exports = require('./cjs/react-cache.development.js');
}

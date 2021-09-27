'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react-noop-renderer.production.min.js');
} else {
  module.exports = require('./cjs/react-noop-renderer.development.js');
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment node
 */
'use strict';

describe('Scheduling UMD bundle', () => {
  beforeEach(() => {
    // Fool SECRET_INTERNALS object into including UMD forwarding methods.
    global.__UMD__ = true;

    jest.resetModules();
  });

  function filterPrivateKeys(name) {
    // TODO: Figure out how to forward priority levels.
    return !name.startsWith('_') && !name.endsWith('Priority');
  }

  function validateForwardedAPIs(api, forwardedAPIs) {
    const apiKeys = Object.keys(api)
      .filter(filterPrivateKeys)
      .sort();
    forwardedAPIs.forEach(forwardedAPI => {
      expect(
        Object.keys(forwardedAPI)
          .filter(filterPrivateKeys)
          .sort(),
      ).toEqual(apiKeys);
    });
  }

  it('should define the same scheduling API', () => {
    const api = require('../../index');
    const umdAPIDev = require('../../npm/umd/scheduler.development');
    const umdAPIProd = require('../../npm/umd/scheduler.production.min');
    const umdAPIProfiling = require('../../npm/umd/scheduler.profiling.min');
    const secretAPI = require('react/src/ReactSharedInternals').default;
    validateForwardedAPIs(api, [
      umdAPIDev,
      umdAPIProd,
      umdAPIProfiling,
      secretAPI.Scheduler,
    ]);
  });

  it('should define the same tracing API', () => {
    const api = require('../../tracing');
    const umdAPIDev = require('../../npm/umd/scheduler-tracing.development');
    const umdAPIProd = require('../../npm/umd/scheduler-tracing.production.min');
    const umdAPIProfiling = require('../../npm/umd/scheduler-tracing.profiling.min');
    const secretAPI = require('react/src/ReactSharedInternals').default;
    validateForwardedAPIs(api, [
      umdAPIDev,
      umdAPIProd,
      umdAPIProfiling,
      secretAPI.SchedulerTracing,
    ]);
  });
});

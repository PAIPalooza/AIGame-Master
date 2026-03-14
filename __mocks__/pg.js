/**
 * Manual Jest mock for 'pg'.
 *
 * Used when the real pg package is not installed (e.g. in CI environments that
 * only run file-based tests). Any test suite that imports lib/db.ts indirectly
 * will receive this stub instead of crashing on a missing module.
 *
 * Tests that require a real database connection use `describeIfDb` to skip
 * themselves when pg is unavailable.
 */

'use strict';

const noop = () => Promise.resolve({ rows: [], rowCount: 0 });

function Pool() {}
Pool.prototype.on = function () { return this; };
Pool.prototype.connect = function () {
  return Promise.resolve({
    query: noop,
    release: function () {},
  });
};
Pool.prototype.query = noop;
Pool.prototype.end = function () { return Promise.resolve(); };

module.exports = { Pool };

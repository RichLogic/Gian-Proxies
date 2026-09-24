import assert from 'node:assert/strict';
import test from 'node:test';

import {
  compareGrokVersions,
  extensionSupportFromInitialize,
  GROK_EXT_METHOD_FLOORS,
} from '../src/runtime/grok-extensions.js';

test('compareGrokVersions orders semver triplets numerically', () => {
  assert.equal(compareGrokVersions('1.0.4', '1.0.41'), -1);
  assert.equal(compareGrokVersions('1.0.41', '1.0.4'), 1);
  assert.equal(compareGrokVersions('1.0.41', '1.0.41'), 0);
  assert.equal(compareGrokVersions('0.2.99', '1.0.0'), -1);
  assert.equal(compareGrokVersions('1.10.0', '1.9.0'), 1);
});

test('extension support requires the stdio grok agent identity', () => {
  const support = extensionSupportFromInitialize({ _meta: { grokShell: true, agentVersion: '1.0.41' } });
  assert.equal(support.grokShell, true);
  assert.equal(support.agentVersion, '1.0.41');
  assert.equal(support.supports('x.ai/session/fork'), true);
  assert.equal(support.supports('x.ai/interject'), true);
  assert.equal(support.supports('x.ai/mcp/list'), true);
});

test('extension support is absent without grokShell even with a version', () => {
  const support = extensionSupportFromInitialize({ _meta: { agentVersion: '1.0.41' } });
  assert.equal(support.supports('x.ai/session/fork'), false);
  assert.match(support.unsupportedReason('x.ai/session/fork'), /stdio grok agent/);
});

test('0.2.x runtimes are honestly below every extension floor', () => {
  const support = extensionSupportFromInitialize({ _meta: { grokShell: true, agentVersion: '0.2.118' } });
  for (const method of Object.keys(GROK_EXT_METHOD_FLOORS)) {
    assert.equal(support.supports(method as keyof typeof GROK_EXT_METHOD_FLOORS), false, method);
  }
  assert.match(
    support.unsupportedReason('x.ai/session/rename'),
    /0\.2\.118 predates x\.ai\/session\/rename \(requires 1\.0\.0\+\)/,
  );
});

test('missing agentVersion cannot be assumed extension-capable', () => {
  const support = extensionSupportFromInitialize({ _meta: { grokShell: true } });
  assert.equal(support.supports('x.ai/session/delete'), false);
  assert.match(support.unsupportedReason('x.ai/session/delete'), /did not report agentVersion/);
});

test('missing _meta degrades to no extension support', () => {
  const support = extensionSupportFromInitialize(null);
  assert.equal(support.supports('x.ai/session/fork'), false);
});

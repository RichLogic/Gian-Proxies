import assert from 'node:assert/strict';
import test from 'node:test';
import { assertSameCatalogExecutables } from './catalog-docs-policy.mjs';

const base = { sourceId: 'gian-official', sequence: 8, plugins: [{ pluginId: 'fixture', tagline: 'Old',
  documentation: { overview: 'old.md' }, stable: { pluginVersion: '0.3.1',
    artifacts: { 'darwin-arm64': { url: 'https://example.test/proxy', sha256: 'abc', size: 10 } },
    combination: { runtime: { version: '1.0', artifactSha256: '123' }, certificate: { id: 'original', sha256: 'def' } },
  } }] };

test('documentation refresh preserves exact executable and proof identities', () => {
  const next = structuredClone(base);
  next.sequence++;
  next.plugins[0].tagline = 'Translated';
  next.plugins[0].documentation.overview = 'new.md';
  assert.doesNotThrow(() => assertSameCatalogExecutables(base, next));
  for (const mutate of [
    x => { x.plugins[0].stable.pluginVersion = '0.4.0'; },
    x => { x.plugins[0].stable.combination.runtime.artifactSha256 = 'changed'; },
    x => { x.plugins[0].stable.combination.certificate.sha256 = 'changed'; },
    x => { x.plugins[0].stable.artifacts['darwin-arm64'].url = 'https://other.test/proxy'; },
    x => { x.plugins = []; },
    x => { x.sequence = 8; },
    x => { x.sourceId = 'other'; },
  ]) {
    const invalid = structuredClone(next); mutate(invalid);
    assert.throws(() => assertSameCatalogExecutables(base, invalid));
  }
});

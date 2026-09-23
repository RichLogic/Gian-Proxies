import { isDeepStrictEqual } from 'node:util';

export function assertSameCatalogExecutables(previous, next) {
  if (next.sourceId !== previous.sourceId || next.sequence <= previous.sequence) {
    throw new Error('Documentation refresh must retain source identity and increase sequence');
  }
  const identities = index => index.plugins.map(plugin => ({ pluginId: plugin.pluginId, stable: plugin.stable }))
    .sort((left, right) => left.pluginId.localeCompare(right.pluginId));
  if (!isDeepStrictEqual(identities(previous), identities(next))) {
    throw new Error('Documentation refresh cannot change Proxy, Runtime or certification coordinates');
  }
}

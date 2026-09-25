import { isDeepStrictEqual } from 'node:util';

export function selectReleaseDefinitions(definitions, selection) {
  const shipping = definitions.filter(item => item.shipping);
  if (selection?.schema !== 1 || !Array.isArray(selection.providers) || !selection.providers.length
    || new Set(selection.providers).size !== selection.providers.length
    || selection.providers.some(id => !shipping.some(item => item.id === id))
    || !/^catalog-v1\.[1-9][0-9]*\.0$/.test(selection.baseCatalogTag ?? '')) {
    throw new Error('Invalid explicit Proxy release selection or signed base Catalog');
  }
  return shipping.filter(item => selection.providers.includes(item.id));
}

export function assertSelectedCatalogExecutables(previous, next, selectedIds) {
  if (next.sourceId !== previous.sourceId || next.sequence <= previous.sequence
    || new Set(selectedIds).size !== selectedIds.length
    || selectedIds.some(id => !next.plugins.some(plugin => plugin.pluginId === id))) {
    throw new Error('Invalid selected Catalog update identity');
  }
  const previousIds = new Set(previous.plugins.map(plugin => plugin.pluginId));
  const nextIds = new Set(next.plugins.map(plugin => plugin.pluginId));
  if ([...previousIds].some(id => !nextIds.has(id))) throw new Error('Selected update cannot remove Proxies');
  if ([...nextIds].some(id => !previousIds.has(id) && !selectedIds.includes(id))) {
    throw new Error('Selected update cannot add an unselected Proxy');
  }
  for (const old of previous.plugins) {
    if (!selectedIds.includes(old.pluginId)
      && !isDeepStrictEqual(old.stable, next.plugins.find(plugin => plugin.pluginId === old.pluginId)?.stable)) {
      throw new Error(`Excluded Proxy executable identity changed: ${old.pluginId}`);
    }
  }
}

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

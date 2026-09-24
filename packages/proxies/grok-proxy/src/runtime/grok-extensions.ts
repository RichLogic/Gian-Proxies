/**
 * Native `x.ai/*` extension-method support detection for the stdio
 * `grok agent` runtime.
 *
 * The stdio agent (identified by `InitializeResponse._meta.grokShell === true`)
 * registers its administrative surface as ACP extension requests rather than
 * standard ACP methods; notably it does NOT advertise the standard
 * `session/fork` capability even though `x.ai/session/fork` exists. Support is
 * therefore decided from the reported `_meta.agentVersion` against the floors
 * below, which were verified against the xai-org/grok-build source shipped in
 * the 1.0 line (manifest-verified runtime floor: 1.0.4; wire contract
 * re-verified against the 1.0.41-era tree).
 *
 * 0.2.x CLI versions are intentionally treated as not extension-capable: the
 * per-release registration of these methods in the 0.2 line cannot be
 * verified from source, so the Proxy reports the capability as unsupported
 * instead of guessing.
 */

/** Minimum stdio-agent version that registers each extension method. */
export const GROK_EXT_METHOD_FLOORS = {
  'x.ai/interject': '1.0.0',
  'x.ai/session/fork': '1.0.0',
  'x.ai/session/rename': '1.0.0',
  'x.ai/session/delete': '1.0.0',
  'x.ai/session/update_mcp_servers': '1.0.0',
  'x.ai/session/usage': '1.0.0',
  'x.ai/mcp/list': '1.0.0',
  'x.ai/skills/list': '1.0.0',
  'x.ai/hooks/list': '1.0.0',
} as const;

export type GrokExtMethod = keyof typeof GROK_EXT_METHOD_FLOORS;

export function compareGrokVersions(left: string, right: string): -1 | 0 | 1 {
  const parse = (value: string) => value
    .split(/[-+]/, 1)[0]!
    .split('.')
    .map((part) => Number.parseInt(part, 10));
  const [leftParts, rightParts] = [parse(left), parse(right)];
  const length = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < length; index += 1) {
    const delta = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (delta !== 0) return delta < 0 ? -1 : 1;
  }
  return 0;
}

export interface GrokExtensionSupport {
  /** True when the runtime is the stdio `grok agent` that registers x.ai/* methods. */
  readonly grokShell: boolean;
  readonly agentVersion: string | null;
  supports(method: GrokExtMethod): boolean;
  /** Human-readable reason a method is unavailable, for honest CAPABILITY_NOT_SUPPORTED errors. */
  unsupportedReason(method: GrokExtMethod): string;
}

class VersionedExtensionSupport implements GrokExtensionSupport {
  constructor(
    readonly grokShell: boolean,
    readonly agentVersion: string | null,
  ) {}

  supports(method: GrokExtMethod): boolean {
    if (!this.grokShell || !this.agentVersion) return false;
    const floor = GROK_EXT_METHOD_FLOORS[method];
    return compareGrokVersions(this.agentVersion, floor) >= 0;
  }

  unsupportedReason(method: GrokExtMethod): string {
    if (!this.grokShell) {
      return `Grok runtime does not identify itself as the stdio grok agent; ${method} is unavailable.`;
    }
    const floor = GROK_EXT_METHOD_FLOORS[method];
    if (!this.agentVersion) {
      return `Grok runtime did not report agentVersion; ${method} (requires ${floor}+) cannot be assumed.`;
    }
    if (compareGrokVersions(this.agentVersion, floor) < 0) {
      return `Grok runtime ${this.agentVersion} predates ${method} (requires ${floor}+).`;
    }
    return `${method} is not available in this Grok runtime.`;
  }
}

export const NO_EXTENSION_SUPPORT: GrokExtensionSupport = new VersionedExtensionSupport(false, null);

export function extensionSupportFromInitialize(
  initialized: { _meta?: unknown } | null | undefined,
): GrokExtensionSupport {
  const meta = initialized && typeof initialized === 'object'
    ? (initialized as { _meta?: unknown })._meta
    : undefined;
  if (!meta || typeof meta !== 'object') return NO_EXTENSION_SUPPORT;
  const record = meta as Record<string, unknown>;
  const grokShell = record.grokShell === true;
  const agentVersion = typeof record.agentVersion === 'string' && record.agentVersion.trim()
    ? record.agentVersion.trim()
    : null;
  return new VersionedExtensionSupport(grokShell, agentVersion);
}

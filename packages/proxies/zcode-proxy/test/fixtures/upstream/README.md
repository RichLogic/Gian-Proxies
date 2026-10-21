This unmodified fixture is the ZCode protocol entrypoint at commit
`3c5b227649371507ddc4eb46ac5133afe6db1cab` (App-source version `3.16.2`, CLI `0.17.0`).

Source: https://github.com/zai-org/ZCode/blob/3c5b227649371507ddc4eb46ac5133afe6db1cab/apps/zcode-cli/packages/bootstrap/src/zcode-protocol-entrypoint.ts

Upstream license: Apache-2.0, https://github.com/zai-org/ZCode/blob/3c5b227649371507ddc4eb46ac5133afe6db1cab/LICENSE

The Runtime integration test transforms these exact bytes through the production
overlay; the source lock owns its SHA-256. Keep the fixture byte-for-byte original.

`zcode-session-list-params.ts.txt` is the unmodified list-parameter declaration
from the same commit's `packages/shared/src/zcode-protocol/index.ts`. Its strict
object removes `includeArchived`; the fake Runtime rejects that obsolete key,
and the native-history regression exercises the actual Proxy request.

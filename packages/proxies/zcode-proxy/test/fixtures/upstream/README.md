This unmodified fixture is the ZCode protocol entrypoint at commit
`0a1fc56d279fd1001f78387bd81aec1c26767411` (App-source version `3.16.1`, CLI `0.17.0`).

Source: https://github.com/zai-org/ZCode/blob/0a1fc56d279fd1001f78387bd81aec1c26767411/apps/zcode-cli/packages/bootstrap/src/zcode-protocol-entrypoint.ts

Upstream license: Apache-2.0, https://github.com/zai-org/ZCode/blob/0a1fc56d279fd1001f78387bd81aec1c26767411/LICENSE

The Runtime integration test transforms these exact bytes through the production
overlay; the source lock owns its SHA-256. Keep the fixture byte-for-byte original.

`zcode-session-list-params.ts.txt` is the unmodified list-parameter declaration
from the same commit's `packages/shared/src/zcode-protocol/index.ts`. Its strict
object removes `includeArchived`; the fake Runtime rejects that obsolete key,
and the native-history regression exercises the actual Proxy request.

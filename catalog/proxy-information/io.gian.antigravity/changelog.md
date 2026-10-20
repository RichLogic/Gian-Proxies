# Antigravity：版本更新

本文件由 changelog.json 的结构化记录投影，按 Proxy 版本倒序。首次发布日期与新仓库分发日期分别记录；未知历史不会用当前版本说明回填。

本次发布组合快照：Proxy **0.0.2**，Runtime **1.4.1**。这是发布目标，不表示当前机器已安装。

## 0.0.2

首次公开发布：2026-10-20T01:01:11Z（UTC）。

- [RichLogic/Gian-Proxies 分发](https://github.com/RichLogic/Gian-Proxies/releases/tag/proxy-antigravity-v0.0.2)：2026-10-20T01:01:11Z。
- 对应 CLI：1.4.1（Manifest 兼容声明，不是本机状态）。

### 变更

- 将上游 Antigravity ACP Runtime 更新至 1.4.1（ACP registry 当前版本；官方 dl.google.com ZIP 通过严格成对校验与字节固定）。ACP initialize 契约复验：核心会话/输入/MCP/认证能力不变；1.4.1 新增可选 _meta.antigravity（tier、systemPrompt.append）元数据，未采纳为 Gian 能力。线协议范围不变。产物经过托管认证；本次发行未运行真实模型 Turn。 [依据1](https://github.com/RichLogic/Gian-Proxies/releases/tag/proxy-antigravity-v0.0.2) [依据2](https://github.com/RichLogic/Gian-Proxies/blob/proxy-antigravity-v0.0.2/packages/proxies/antigravity-proxy/README.md)

## 0.0.1

首次公开发布：2026-10-18T11:46:36Z（UTC）。

- [RichLogic/Gian-Proxies 分发](https://github.com/RichLogic/Gian-Proxies/releases/tag/proxy-antigravity-v0.0.1)：2026-10-18T11:46:36Z。
- 对应 CLI：1.3.0（Manifest 兼容声明，不是本机状态）。

### 新增

- 首次收录：接入 Google 官方 Antigravity ACP Server 1.3.0，支持文本 Turn、原生工具批准、取消、上下文占用与分离/恢复；Fork、Side Chat、原生历史重放、多媒体输入与计费令牌总量不在本次范围。产物经过托管认证；产物认证明确不含真实 Provider Turn 验收。 [依据1](https://github.com/RichLogic/Gian-Proxies/releases/tag/proxy-antigravity-v0.0.1) [依据2](https://github.com/RichLogic/Gian-Proxies/blob/proxy-antigravity-v0.0.1/packages/proxies/antigravity-proxy/README.md)

## 已撤回版本

无。

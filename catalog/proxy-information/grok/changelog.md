# Grok Build：版本更新

本文件由 changelog.json 的结构化记录投影，按 Proxy 版本倒序。首次发布日期与新仓库分发日期分别记录；未知历史不会用当前版本说明回填。

本次发布组合快照：Proxy **0.3.5**，Runtime **1.0.41**。这是发布目标，不表示当前机器已安装。

## 0.3.5

首次公开发布：2026-09-25T11:27:45Z（UTC）。

- [RichLogic/Gian-Proxies 分发](https://github.com/RichLogic/Gian-Proxies/releases/tag/proxy-grok-v0.3.5)：2026-09-25T11:27:45Z。
- 对应 CLI：1.0.41（Manifest 兼容声明，不是本机状态）。

### 新增

- Grok 4.7 真实会话支持本地文件、工具审批、历史回放和结构化事件。 [依据](https://github.com/RichLogic/Gian-Proxies/releases/tag/proxy-grok-v0.3.5)

### 变更

- 对 Grok CLI 1.0.41 的 x.ai 扩展按真实方法能力收窄；未注册的 Steer、Rename、Fork、Side Chat 和原生删除不会在 Catalog 中宣告。 [依据](https://github.com/RichLogic/Gian-Proxies/commit/c458424b5030bb93dd7d127fa5d091ec127e6bbd)

### 修复

- 交互响应可在活动 Turn 期间并发处理，避免工具审批阻塞请求循环。 [依据](https://github.com/RichLogic/Gian-Proxies/commit/10d4d7c0b60632c5cd53c8da6661020052f5a177)

## 已撤回版本

0.4.0 已于 2026-09-20 撤回，不进入可用版本列表。仓库拆分不构成统一升级所有 Proxy 版本的理由。

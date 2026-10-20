# Antigravity

## 1. 在 Gian 中做什么

Antigravity Integration 将 Google 官方 Antigravity ACP Server 接入 Gian：在 Gian 中创建和管理 Antigravity 会话，发送文本任务，查看工具活动与审批请求。Proxy 0.0.1 对应上游 ACP Runtime 1.3.0；Proxy 与上游 Runtime 版本相互独立。这不是对独立 `agy --print` CLI 的包装。

## 2. 支持的能力与限制

支持文本 Turn、原生工具批准、取消、上下文占用显示，以及会话分离/恢复。模型目录只列出 Runtime 实际广告的 Gemini 模型；Gian 将支持的原生变体拆分为 Model 与 Thinking 控件，并把确切的原生模型 ID 传给 Runtime。Mode 也是原生的：`default`（正常权限提示）、`auto_edit`（自动批准文件编辑）、`yolo`（自动批准全部工具），默认保守的 `default`。

本次不支持：Fork、Side Chat、原生历史重放、多媒体输入与计费令牌总量。即使上游广告了多媒体能力，首个输入仍仅限文本。真实 Provider 请求需要单独验收，安装成功不等于模型请求已成功。

## 3. 运行原理与进程关系

```text
Gian Host → Antigravity Proxy → 共享 ACP Server（agy_acp_server.par + localharness_external）→ Gemini
```

Proxy 与 ACP Server 之间使用 ACP（Agent Client Protocol）stdio 通信。一条连接服务一个 Agent/Runtime 绑定；上游为每个原生会话管理独立的本地 harness。Gian 关闭会话采用 detach 语义，不删除原生历史。

## 4. 安装与依赖

从 Gian 的官方 Catalog 安装 Antigravity Integration。Gian 校验并准备 Proxy 及固定版本的 Runtime；Runtime 必须保持同一固定官方 1.3.0 归档中的 `agy_acp_server.par` 与 `localharness_external` 成对存在。Gian 不会用系统 `agy` 可执行文件替代该服务器。冷的 Gemini 模型查询需要单独的官方 `agy` CLI——它是与 ACP Server 不同的组件；缺少该组件表现为目录不可用，而不是空模型列表。安装说明参见官方 ACP 指南 https://antigravity.google/docs/ide/extensions/zed/ 。

## 5. 第一次使用

1. 在 Gian 中安装并准备 Antigravity Integration，确认 Proxy 与 Runtime 校验成功。
2. 需要账号时通过官方 ACP 登录流程完成认证（这是显式的用户操作，可能打开浏览器）。
3. 在 Agent 中选择模型、Thinking 与 Mode，先进行小范围文本任务；不支持的组合会在发送前失败，而不是被猜测或静默替换。

本说明不代表当前机器已经完成真实模型请求验收。

## 6. HOME 与隔离

目录检查使用操作系统账号的 HOME 及其默认 `~/.gemini` 配置；受管或自定义 HOME 会被该查询拒绝。Proxy 不复制凭据，也不静默改写选定的 HOME。Runtime 文件与账号配置位于不同位置；不要把嵌套的 `antigravity-acp` 目录当作 Gemini 根目录。在 macOS 上，仅改变文件系统 HOME 并不能隔离 Keychain 状态。

## 7. 反向代理与自定义端点

仅使用官方支持的认证与端点配置。Proxy 层不提供自定义端点设置；端点配置不能修复 Runtime 版本或协议不兼容。原生全局 MCP 配置可以补充 Gian 的按会话 MCP 描述符，但这不是隔离保证。

## 8. 操作注意事项

- 审批按钮返回该请求实际广告的选项 ID；拒绝不是允许操作。
- 断开、取消或状态不确定的 Turn 不会被盲目重放；继续之前先检查其状态。
- 上下文占用在可用时显示；不合成货币用量或计费令牌总量。
- 旧版包含完整原生变体 ID 的默认选择在省略单独 Thinking 值时仍被接受；冲突的显式选择会被拒绝而非强制转换。

## 9. 故障排查

- 目录不可用或超时：检查单独的官方 `agy` 组件安装与默认 OS HOME/Gemini 根目录，然后手动重试；不要清空已保存的 Agent 默认值或复制凭据。
- 模型/Thinking 组合被拒绝或目录陈旧：刷新当前 Proxy 广告并检查保留的显式选择；不要用猜测的原生 ID 或静默默认值替换。
- Runtime 未检测到或探测被拒绝：确认来自同一已校验 1.3.0 归档的 server 与 harness 是可执行的同级文件；报告相同版本的其他 ACP agent 不是本 Runtime。
- 提示需要账号：使用官方 ACP 登录操作；版本探测成功不证明账号就绪或模型 Turn 成功。
- 审批不再待处理：重新打开当前请求；不要重放来自旧 Turn 的选项。
- Turn 中断或崩溃：先检查原生/会话状态再重新发送；取消或传输不确定性不构成自动重发的授权。
- 报告中给出受控错误码与 Proxy/Runtime 版本即可，不要附带令牌、账号文件或原始 OAuth 诊断。

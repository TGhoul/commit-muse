# Commit Muse

[English](./README.md)

<p align="center">
  <img src="https://raw.githubusercontent.com/TGhoul/commit-muse/main/resources/logo.png" alt="Commit Muse logo" width="128" />
</p>

Commit Muse 会根据已暂存的改动，在 VS Code 里生成 Git commit message。它直接挂在 Source Control 里，支持 Anthropic 和 OpenAI-compatible 接口，生成后会把结果写进 SCM 输入框。

## 功能

- 根据已暂存改动生成 commit message
- 支持先给一条 hint 再生成
- 直接把结果写进 Source Control 输入框
- 支持 Anthropic 和 OpenAI-compatible 接口
- 支持按你设置的语言输出 commit message
- 内置 Basic、Conventional Commit、GitMoji 三种 prompt preset，也可以自定义 prompt
- diff 过长时会截断，并在生成后给出提示

## 安装

从 Visual Studio Code Marketplace 安装 **Commit Muse**，然后在 VS Code 里打开一个 Git 仓库。

## 快速开始

1. 先暂存这次要提交的改动。
2. 在 **Settings** 里配置：
   - `commitMuse.provider`
   - `commitMuse.model`
   - 如果服务需要自定义接口地址，再配置 `commitMuse.baseUrl`
3. 先运行一次 **Commit Muse: Verify Provider**。第一次使用时，Commit Muse 会提示你输入 API key，并保存在 VS Code Secret Storage 里。
4. 打开 **Source Control**。
5. 点击顶部工具栏里的两个动作之一：
   - **Generate Message**
   - **Generate Message With Hint**
6. 生成结果会写进 SCM 输入框，确认后直接提交。

## Commands

| Command | 说明 |
| --- | --- |
| `Commit Muse: Generate Message` | 根据已暂存改动生成 commit message。 |
| `Commit Muse: Generate Message With Hint` | 先输入一条简短 hint，再生成 commit message。 |
| `Commit Muse: Verify Provider` | 检查当前 provider、model 和 API key 是否可用。 |
| `Commit Muse: Open Settings` | 直接打开扩展设置。 |

## Settings

| 设置项 | 默认值 | 说明 |
| --- | --- | --- |
| `commitMuse.provider` | `anthropic` | 当前使用的 provider。 |
| `commitMuse.model` | `claude-3-5-sonnet-latest` | 当前 provider 对应的 model ID。 |
| `commitMuse.baseUrl` | `""` | Anthropic 或 OpenAI-compatible 接口的可选 base URL。 |
| `commitMuse.locale` | `en` | 生成 commit message 时使用的语言。 |
| `commitMuse.timeoutMs` | `30000` | 请求超时时间，单位是毫秒。 |
| `commitMuse.maxDiffChars` | `12000` | 发送给模型的 staged diff 最大长度。 |
| `commitMuse.promptPreset` | `basic` | 内置 prompt preset，可选 `basic`、`conventional`、`gitmoji` 或 `custom`。 |
| `commitMuse.promptTemplate` | preset value | 当 `promptPreset` 为 `custom` 时使用的自定义 prompt。 |

## 说明

- Commit Muse 只对已暂存改动生效。
- 如果 staged diff 超过 `commitMuse.maxDiffChars`，扩展会先截断再生成，并在生成后给出提示。
- 如果你用的是 OpenAI-compatible 服务，按服务要求填写 `commitMuse.baseUrl`。

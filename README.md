# Commit Muse

[简体中文](./README.zh-CN.md)

<p align="center">
  <img src="./resources/logo.png" alt="Commit Muse logo" width="128" />
</p>

Commit Muse generates Git commit messages from staged changes inside VS Code. It lives in Source Control, supports Anthropic and OpenAI-compatible providers, and writes the result straight into the SCM input box.

## Features

- Generate a commit message from staged changes
- Add an optional hint when you want to steer the result
- Write the generated message directly into the Source Control input box
- Use Anthropic or any OpenAI-compatible endpoint
- Output commit messages in your chosen language
- Choose from Basic, Conventional Commit, GitMoji, or a custom prompt
- Warn when the diff had to be truncated before generation

## Install

Install **Commit Muse** from the Visual Studio Code Marketplace, then open a Git repository in VS Code.

## Quick start

1. Stage the changes you want to commit.
2. Open **Settings** and configure:
   - `commitMuse.provider`
   - `commitMuse.model`
   - `commitMuse.baseUrl` if your provider needs a custom endpoint
3. Run **Commit Muse: Verify Provider** once. On first use, Commit Muse asks for your API key and stores it in VS Code Secret Storage.
4. Open **Source Control**.
5. Click one of the toolbar actions:
   - **Generate Message**
   - **Generate Message With Hint**
6. Review the generated text in the SCM input box and commit.

## Commands

| Command | Description |
| --- | --- |
| `Commit Muse: Generate Message` | Generate a commit message from staged changes. |
| `Commit Muse: Generate Message With Hint` | Ask for a short hint, then generate a commit message. |
| `Commit Muse: Verify Provider` | Check that the current provider, model, and API key work. |
| `Commit Muse: Open Settings` | Open the extension settings in VS Code. |

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `commitMuse.provider` | `anthropic` | Active provider. |
| `commitMuse.model` | `claude-3-5-sonnet-latest` | Model ID for the active provider. |
| `commitMuse.baseUrl` | `""` | Optional base URL for Anthropic or OpenAI-compatible endpoints. |
| `commitMuse.locale` | `en` | Language used for generated commit messages. |
| `commitMuse.timeoutMs` | `30000` | Request timeout in milliseconds. |
| `commitMuse.maxDiffChars` | `12000` | Maximum staged diff size sent to the model. |
| `commitMuse.promptPreset` | `basic` | Built-in prompt preset: `basic`, `conventional`, `gitmoji`, or `custom`. |
| `commitMuse.promptTemplate` | preset value | Custom prompt template when `promptPreset` is `custom`. |

## Notes

- Commit Muse only works with staged changes.
- If the staged diff exceeds `commitMuse.maxDiffChars`, Commit Muse truncates the diff and shows a warning after generation.
- If you use an OpenAI-compatible service, set `commitMuse.baseUrl` to that service's API endpoint when needed.

# Codespaces 設定

このディレクトリには、GitHub Codespaces用の設定ファイルが含まれています。

## ファイル説明

### `devcontainer.json`
Codespacesコンテナの設定ファイル。以下を自動設定します：

- **Node.js 20**: JavaScript/TypeScript開発環境
- **VS Code拡張機能**: ESLint, Prettier, Tailwind CSS
- **ポート転送**: 3000番ポート（Next.js開発サーバー）
- **自動セットアップ**: `npm install` を自動実行

## 使い方

### Codespacesの起動

1. GitHubリポジトリページで「Code」ボタンをクリック
2. 「Codespaces」タブを選択
3. 「Create codespace on [ブランチ名]」をクリック

### 開発サーバーの起動

ターミナルで：
```bash
npm run dev
```

自動的にポート3000が転送され、ブラウザからアクセスできます。

### モバイルからの利用

スマホ・タブレットのブラウザから直接Codespacesにアクセスできます。
詳細は `MOBILE_DEV.md` を参照してください。

## カスタマイズ

### VS Code拡張機能を追加

`devcontainer.json` の `customizations.vscode.extensions` 配列に追加：

```json
"extensions": [
  "dbaeumer.vscode-eslint",
  "your-extension-id"
]
```

### Node.jsバージョン変更

`features` セクションで指定：

```json
"features": {
  "ghcr.io/devcontainers/features/node:1": {
    "version": "18"  // または "20", "latest"
  }
}
```

### ポート転送を追加

`forwardPorts` 配列に追加：

```json
"forwardPorts": [3000, 8080]
```

## トラブルシューティング

### 拡張機能が動作しない
Codespacesを再起動するか、拡張機能を手動でリロードしてください。

### ポート転送が機能しない
`PORTS` タブで手動で3000番ポートを追加してください。

### インストールエラー
`postCreateCommand` が失敗した場合、手動で `npm install` を実行してください。

## リソース

- [Codespaces Documentation](https://docs.github.com/ja/codespaces)
- [Dev Container Specification](https://containers.dev/)
- [Available Features](https://containers.dev/features)

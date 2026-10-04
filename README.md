# News for Codex

A local Markdown news archive reader with a sidebar entry, full-text search, bookmarks, original source links, and light/dark themes. Built as a Codex plugin with an MCP Apps reader.

## Install

Requires a supported Codex desktop client, Git, and **Node.js 22 or newer** available as `node` on PATH. Runtime dependencies and browser libraries are bundled; users do not need to run npm install.

```sh
codex plugin marketplace add laughmaker/news-codex
codex plugin add news@news-codex
```

Restart Codex, then open **News** from the sidebar or ask “Open News”. Client support for MCP Apps and sidebar entries is required; CLI installation does not itself render the reader.

The initial view contains a labeled sample edition. Your existing news is not uploaded or included in the plugin.

## Choose your archive

Create `~/.config/news-codex/config.json` with an absolute folder path:

```json
{
  "newsDir": "/absolute/path/to/your/news"
}
```

On Windows, use your user-profile `.config/news-codex/config.json` and a path such as `C:/Users/YourName/Documents/News`. Restart Codex after changing configuration. `NEWS_DIR`, if set in the server environment, overrides this setting. Without configuration, the bundled sample folder is used. An invalid configuration or missing configured folder reports an error rather than silently switching archives.

Store UTF-8 Markdown editions directly in that folder. Accepted filenames include `2026-10-04-topic.md` and `20261004-topic.md`. Use a top-level `# Title` and preserve original source URLs. Reload/reopen the reader after adding files; there is no background watcher, news scraping, hosted feed, or scheduler.

Search covers all editions. Load more reveals five at a time. Bookmarks remain in the reader's local browser storage and may differ across hosts. Dates and popularity figures remain historical snapshots.

## Update or uninstall

```sh
codex plugin marketplace upgrade news-codex
codex plugin add news@news-codex
```

Restart Codex after updating. To uninstall:

```sh
codex plugin remove news@news-codex
codex plugin marketplace remove news-codex
```

Uninstalling does not delete your archive.

## Develop

```sh
npm ci --prefix plugins/news
npm run build --prefix plugins/news
npm run check --prefix plugins/news
npm run preview --prefix plugins/news
```

Preview: http://127.0.0.1:43128 (local only). The built `plugins/news/dist/server.mjs` and browser assets are committed for installation without dependency setup. Rebuild after server or library changes.

## Privacy and limitations

News reads only dated Markdown files in the configured folder and exposes their contents to the host when tools are used. It performs no outbound news requests and adds no telemetry; following a source link opens that external website. The host's own data handling still applies. Browser rendering sanitizes Markdown and removes remote images. Bookmarks use localStorage; persistence depends on host support.

This release is distributed through a GitHub marketplace; it has not been submitted to the official public plugin directory. macOS runtime and package installation are tested; Windows/Linux client rendering is not yet verified.

## License

MIT. Bundled libraries retain their notices under `plugins/news/assets/vendor/` and `plugins/news/dist/THIRD_PARTY_NOTICES.txt`. Your archive content remains yours.

Official references: [Plugin packaging](https://developers.openai.com/plugins/build/plugins), [MCP UI extensions](https://developers.openai.com/plugins/build/extensions).

# WoodcutTool

Static website for [woodcuttool.com](https://woodcuttool.com/), deployed with Cloudflare Pages.

## Local development

```sh
npm run dev
```

The local server uses port `4175`.

## Validation

```sh
npm run check
```

This checks that the sitemap entries have matching local pages and that internal links point to existing routes or files.

## Cloudflare Pages

Use these settings when connecting the GitHub repository:

- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `.`
- Production branch: `master`
- Custom domain: `woodcuttool.com`

The repository includes:

- `_headers` for security and cache headers.
- `_redirects` for `www` to apex domain and canonical `index.html` redirects.
- `wrangler.toml` for direct `wrangler pages deploy` compatibility.

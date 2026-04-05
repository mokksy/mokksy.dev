# mokksy Hugo Theme

Apple-inspired dark/light theme for [mokksy.dev](https://mokksy.dev).
Built from scratch — no external theme dependency.

## Requirements

- Hugo **extended** ≥ 0.120 (required for CSS asset pipelines)

## Structure

```
themes/mokksy/
├── assets/
│   ├── css/
│   │   ├── base.css      ← design tokens, typography, reset
│   │   ├── layout.css    ← nav, sidebar, docs grid, landing sections
│   │   ├── docs.css      ← code tabs UI, callouts, breadcrumbs, pagination
│   │   └── chroma.css    ← Hugo Chroma (.highlight) layout + token colours
│   └── js/
│       └── theme.js      ← theme toggle, ToC spy, copy, home hero carousel
├── layouts/
│   ├── index.html                  ← composes partials/home/* (copy: data/home.yaml; hero code: content/home/examples/)
│   ├── partials/home/              ← hero, sections, extract-code-fence (carousel from headless bundle)
│   ├── _default/
│   │   ├── baseof.html             ← root shell
│   │   ├── single.html             ← docs single page
│   │   └── list.html               ← docs section index
│   ├── partials/
│   │   ├── head.html
│   │   ├── nav.html
│   │   ├── sidebar.html            ← auto-built from content tree
│   │   ├── toc.html
│   │   ├── breadcrumb.html
│   │   ├── pagination.html
│   │   └── footer.html
│   └── shortcodes/
│       ├── code-tabs.html          ← Kotlin/Java tabbed code blocks
│       ├── tab.html                ← individual tab (used inside code-tabs)
│       ├── callout.html            ← note / tip / warning / danger
│       └── version-badge.html
└── static/
    └── favicon.svg
```

## Installation

Copy this entire directory into your Hugo project root. No extra tools needed.

```bash
cp -r mokksy-theme/themes/mokksy  <your-hugo-root>/themes/
cp mokksy-theme/hugo.yaml         <your-hugo-root>/hugo.yaml
```

Run the dev server:

```bash
cd <your-hugo-root>
hugo server -D
```

## Dark / Light mode

The theme defaults to dark. It respects `prefers-color-scheme` and persists the
user's choice in `localStorage` under the key `mokksy-theme`.

Toggle values: `"dark"` | `"light"` on `document.documentElement[data-theme]`.

## Sidebar ordering

Control sidebar position with front matter:

```yaml
---
sidebar_order: 10          # lower = higher in the list
sidebar_title: "Custom"    # overrides page title in the nav
sidebar_hide: true         # exclude from sidebar entirely
---
```

## Shortcodes

### `code-tabs` — Kotlin / Java tabs

````markdown
{{</* code-tabs */>}}
{{</* tab lang="kotlin" filename="MyTest.kt" */>}}
val mock = openAiMock()
{{</* /tab */>}}
{{</* tab lang="java" filename="MyTest.java" */>}}
OpenAiMock mock = openAiMock();
{{</* /tab */>}}
{{</* /code-tabs */>}}
````

### `callout` — Admonitions

```markdown
{{</* callout type="tip" */>}}
Content here. Supports **markdown**.
{{</* /callout */>}}
```

Types: `note` | `tip` | `warning` | `danger`

### `version-badge`

```markdown
{{</* version-badge since="0.4.0" */>}}
{{</* version-badge deprecated="0.3.0" */>}}
```

## Syntax highlighting

Hugo's Chroma highlighter is used with `noClasses = false`.
Theme CSS overrides Chroma class colours for both light and dark modes in `chroma.css`.

Supported languages include `kotlin`, `java`, `groovy`, `json`, `yaml`, `bash`, `toml`.

## Licence

MIT

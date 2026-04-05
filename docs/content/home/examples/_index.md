---
title: Homepage code examples
headless: true
---

# Home hero carousel — manifest

Carousel **order** is **`weight`** on each page in this folder (lower first).  
Each page supplies **`title`** (slide label), **`weight`** (order), front matter **`build.render: never`** (no standalone URL), and a markdown **body** with exactly two fenced blocks: one opening with **\`\`\`kotlin** and one with **\`\`\`java** (each closed with **\`\`\`** on its own line).

| Page | Weight | Slide title |
|------|--------|-------------|
| [simple-post.md](simple-post.md) | 10 | Simple POST |
| [streaming-response.md](streaming-response.md) | 20 | Streaming Response |
| [openai-chat-completion.md](openai-chat-completion.md) | 30 | OpenAI Chat Completion |

Rendered only via **`site.GetPage "home/examples"`** in the theme (see **`layouts/partials/home/hero.html`**); example pages are not published as HTML routes.

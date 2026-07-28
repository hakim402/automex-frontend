# Writing rich-text posts (callouts, icons, tables, images)

This is the reference for anything typed into a CMS rich-text field that
gets rendered through `sanitizeRichHtml()` (`lib/automex/rich-content.ts`)
— currently the `AICapability.description` field, and any future field
that uses the same sanitizer.

Two audiences, two sections:
- **Content authors** — just want the list of classes/tags they can type.
- **Developers** — how to add a new icon or a new block type.

---

## 1. For content authors — what you can use

Everything below can be typed straight into the rich-text editor's HTML
source view. Anything not on this list gets silently removed when the
post is rendered — that's intentional (it stops broken styling and
security issues), not a bug, so if something you wrote disappears, check
it's on this list.

### Plain formatting (always available)
`<p>`, `<br>`, `<strong>`, `<b>`, `<em>`, `<i>`, `<u>`, `<s>`, `<h1>`–`<h6>`,
`<ul>`, `<ol>`, `<li>`, `<a href="...">`, `<blockquote>`, `<pre>`, `<code>`,
`<hr>`, `<sub>`, `<sup>`

### Tables — just write a plain table, no class needed
```html
<table>
  <thead>
    <tr><th>Capability</th><th>Accuracy</th></tr>
  </thead>
  <tbody>
    <tr><td>Intent Recognition</td><td>95%</td></tr>
  </tbody>
</table>
```

### Images and figures — no class needed
```html
<figure>
  <img src="https://.../diagram.png" alt="Architecture diagram" />
  <figcaption>How requests flow through the pipeline</figcaption>
</figure>
```

### Callouts — pick one variant
```html
<div class="callout callout-info">Heads up — this needs review.</div>
<div class="callout callout-success">Ready to ship.</div>
<div class="callout callout-warning">Double-check pricing here.</div>
<div class="callout callout-danger">Breaking change.</div>
```

### Highlighted text and centered text
```html
<p>Regular sentence with a <span class="highlight">key term</span> called out.</p>
<p class="text-center">Centered caption line.</p>
```

### Icons
A small inline icon before a word or heading. Currently available:

| Class              | Icon                                   |
|---------------------|-----------------------------------------|
| `icon-check`         | check mark                              |
| `icon-info`          | info circle                             |
| `icon-warning`       | alert triangle                          |
| `icon-star`          | star                                    |
| `icon-zap`           | lightning bolt                          |
| `icon-shield`        | shield-check                            |
| `icon-rocket`        | rocket                                  |
| `icon-arrow-right`   | arrow pointing right                    |

Always pair `icon` with the specific variant class, and always keep it
next to real text — the icon is decorative, so it should never be the
only thing conveying meaning (screen readers skip it):

```html
<p><span class="icon icon-check"></span>Included in every plan</p>
<h3><span class="icon icon-rocket"></span>Deploy in minutes</h3>
```

Need an icon that isn't on the list above? Ask a developer to add it —
takes about two minutes, see part 2 below. Don't try to paste raw
`<svg>...</svg>` markup into a post; it will be stripped.

---

## 2. For developers — adding a new icon or block

### Adding a new icon (3 steps)

1. **Get the exact SVG.** Go to lucide.dev/icons, find the icon, and copy
   its SVG source (the "Copy SVG" button on the icon's page). Save it,
   unmodified, as `/public/icons/<name>.svg` — e.g. `/public/icons/heart.svg`.
   Copying the real file matters: hand-writing SVG path data risks a
   slightly-wrong icon shape.

2. **Allow-list the class token**, in `lib/automex/rich-content.ts`:
   ```ts
   export const CONTENT_CLASS_ALLOWLIST = new Set([
     // ...
     "icon-heart",
   ]);
   ```

3. **Add the CSS rule**, in `styles/content-blocks.css`, following the
   existing pattern:
   ```css
   .prose-content .icon-heart {
     -webkit-mask-image: url("/icons/heart.svg");
     mask-image: url("/icons/heart.svg");
   }
   ```

That's it — `<span class="icon icon-heart"></span>` now works in every
post, forever, with no per-post CSS. Steps 2 and 3 must be added
*together*: a class with CSS but no allow-list entry gets stripped before
it ever reaches the page; an allow-list entry with no CSS renders an empty
box.

### Why mask-image instead of allowing raw `<svg>`

`<svg>` supports `<use href="...">` (can reference off-site resources)
and `<foreignObject>` (can embed arbitrary HTML/CSS inside an SVG,
effectively bypassing tag filtering). Both are known sanitizer-bypass
vectors, so `svg` is deliberately not in `ALLOWED_TAGS`. Using
`mask-image: url("/icons/name.svg")` gets the exact same lucide icon,
recolored automatically to match surrounding text (`currentColor`), while
the SVG file itself is one you control and ships from your own `/public`
folder — not something a CMS author can inject arbitrary markup into.

### Adding a new block type (e.g. a two-column layout, a stat card)

Same two-step pairing as icons: add the class token to
`CONTENT_CLASS_ALLOWLIST` in `rich-content.ts`, add the matching rule to
`content-blocks.css`. Keep new block classes scoped under
`.prose-content` in the CSS so they never leak into the rest of the app's
styling.
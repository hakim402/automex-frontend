// lib/automex/rich-content.ts
//
// Shared sanitizer for CMS-authored rich-text fields (e.g. AICapability.description)
// that get rendered via dangerouslySetInnerHTML. Single source of truth so every
// page that renders rich text behaves identically — previously this logic was
// duplicated per-component and drifted (the listing page had none at all).
//
// SECURITY MODEL — read before changing the allow-lists below:
// - <style>, <script>, event-handler attributes (onClick etc.), and javascript:
//   URIs are always stripped. These are live XSS vectors and must never be
//   allowed through, regardless of "we trust our CMS authors" — a compromised
//   CMS account or a copy-pasted snippet from an untrusted source is enough.
// - `style` and `id` attributes are stripped from every tag, everywhere.
// - `class` is stripped from every tag EXCEPT `div`/`span`, where it is kept
//   only if every class token is in CONTENT_CLASS_ALLOWLIST below. Anything
//   not on that list is dropped silently (not the whole tag — just the
//   unrecognized class name). This is what lets editors use a fixed set of
//   "content blocks" (callouts, highlights) styled once in global CSS,
//   without opening up arbitrary styling or CSS-based UI redress tricks.
// - This is a regex-based sanitizer, not a real HTML parser. It covers
//   well-formed CMS output well but is not bulletproof against pathological
//   input (malformed/nested tags, comment-hidden markup). For a hardened
//   version, swap the tag/attribute filtering below for `isomorphic-dompurify`
//   or `sanitize-html` configured with the same allow-lists.

/** Tags an author may use. Anything else is stripped (content inside is kept). */
const ALLOWED_TAGS = new Set([
    "p", "br", "strong", "b", "em", "i", "u", "s",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "a", "blockquote", "pre", "code", "hr", "sub", "sup",
    "img",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td",
    "figure", "figcaption",
    "div", "span",
]);

/**
 * The only class *tokens* ever allowed through, and only on div/span.
 * Each one must have a matching rule in the global content-blocks CSS
 * (see content-blocks.css). Add new tokens here AND in that CSS file
 * together — never one without the other.
 */
export const CONTENT_CLASS_ALLOWLIST = new Set([
    "callout",
    "callout-info",
    "callout-success",
    "callout-warning",
    "callout-danger",
    "highlight",
    "text-center",
    // Icon tokens — each one below must have a matching CSS rule in
    // content-blocks.css pointing at a real SVG saved under /public/icons/.
    // See docs/writing-posts.md for the full "how to add a new icon" steps.
    "icon",
    "icon-check",
    "icon-info",
    "icon-warning",
    "icon-star",
    "icon-zap",
    "icon-shield",
    "icon-rocket",
    "icon-arrow-right",
]);

/** Per-tag attribute allow-list. Any attribute not listed here is stripped. */
const ATTRS_BY_TAG: Record<string, Set<string>> = {
    a: new Set(["href", "target", "rel"]),
    img: new Set(["src", "alt", "width", "height"]),
    div: new Set(["class"]),
    span: new Set(["class"]),
};

function filterClassAttr(value: string): string | null {
    const kept = value
        .split(/\s+/)
        .filter((token) => CONTENT_CLASS_ALLOWLIST.has(token));
    return kept.length > 0 ? kept.join(" ") : null;
}

function isSafeUrl(value: string): boolean {
    return !/^\s*javascript:/i.test(value);
}

/**
 * Sanitize a rich-text HTML field for safe rendering via
 * dangerouslySetInnerHTML. Strips CSS/JS entirely; keeps a curated set of
 * structural tags plus a fixed allow-list of "content block" class names.
 */
export function sanitizeRichHtml(html: string | undefined | null): string {
    if (!html) return "";

    let cleaned = html;

    // <style> / <script> blocks, wholesale.
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
    cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    // Anything else that can execute or navigate to script: onClick=, href="javascript:...", srcdoc, iframes.
    cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
    cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, "");
    cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

    // Rewrite every remaining tag, keeping only allowed tags + allowed attrs.
    cleaned = cleaned.replace(
        /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g,
        (_match, slash: string, rawTag: string, rawAttrs: string) => {
            const tag = rawTag.toLowerCase();
            if (!ALLOWED_TAGS.has(tag)) return "";
            if (slash) return `</${tag}>`;

            const allowed = ATTRS_BY_TAG[tag];
            if (!allowed) return `<${tag}>`;

            const kept: string[] = [];
            const attrRe = /([a-zA-Z-]+)\s*=\s*"([^"]*)"|([a-zA-Z-]+)\s*=\s*'([^']*)'/g;
            let m: RegExpExecArray | null;
            while ((m = attrRe.exec(rawAttrs))) {
                const name = (m[1] || m[3] || "").toLowerCase();
                const value = m[2] ?? m[4] ?? "";
                if (!allowed.has(name)) continue;

                if ((name === "href" || name === "src") && !isSafeUrl(value)) continue;

                if (name === "class") {
                    const filtered = filterClassAttr(value);
                    if (!filtered) continue;
                    kept.push(`class="${filtered}"`);
                    continue;
                }

                if (name === "target" && value !== "_blank") continue;

                kept.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
            }

            if (tag === "a" && kept.some((a) => a.startsWith("target="))) {
                kept.push('rel="noopener noreferrer"');
            }

            return kept.length > 0 ? `<${tag} ${kept.join(" ")}>` : `<${tag}>`;
        },
    );

    cleaned = cleaned.replace(/\s+/g, " ").trim();

    return cleaned;
}

/**
 * Strip all markup down to plain text — for card/list excerpts where full
 * rich formatting isn't appropriate but the description shouldn't just
 * disappear either.
 */
export function htmlToPlainText(html: string | undefined | null, maxLength?: number): string {
    if (!html) return "";

    let text = html
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<\/(p|div|li|h[1-6]|tr|blockquote)>/gi, " ")
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/\s+/g, " ")
        .trim();

    if (maxLength && text.length > maxLength) {
        text = text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
    }

    return text;
}
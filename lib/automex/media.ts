// lib/automex/media.ts
//
// The API returns fully-qualified media URLs (http://host/media/...).
// getMediaUrl() is built for relative paths, so calling it on an already
// absolute URL is what was causing images to silently fail to load across
// the services and AI-capabilities pages. Route every media URL through
// this resolver instead of calling getMediaUrl() directly.

import { getMediaUrl } from "@/lib/env";

export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return getMediaUrl(url);
}
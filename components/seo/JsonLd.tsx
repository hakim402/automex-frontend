// components/seo/JsonLd.tsx
"use client";

interface JsonLdProps {
  data: Record<string, any>;
  id?: string;
}

export default function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      id={id || "json-ld"}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
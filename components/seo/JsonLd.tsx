// components/seo/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, any>;
  id?: string;
}

export default function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      id={id || "json-ld"}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
// components/seo/BreadcrumbSchema.tsx
import JsonLd from "./JsonLd";
import { BreadcrumbItem } from "@/lib/seo/types";

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  if (!items || items.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://automex.tech${item.url}`,
    })),
  };

  return <JsonLd data={data} id="breadcrumb-schema" />;
}
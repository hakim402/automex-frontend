// components/seo/FAQSchema.tsx
import JsonLd from "./JsonLd";

interface FAQSchemaProps {
  faqs: { q: string; a: string }[];
}

export default function FAQSchema({ faqs }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return <JsonLd data={data} id="faq-schema" />;
}
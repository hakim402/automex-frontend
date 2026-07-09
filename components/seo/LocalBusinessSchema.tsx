// components/seo/LocalBusinessSchema.tsx
import JsonLd from "./JsonLd";
import { localBusinessData } from "@/lib/seo/organization";

export default function LocalBusinessSchema() {
  return <JsonLd data={localBusinessData} id="local-business-schema" />;
}
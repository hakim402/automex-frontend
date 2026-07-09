// lib/seo/keywords.ts
import { SupportedLocale } from "@/lib/locale";

export const PRIMARY_KEYWORDS: Record<SupportedLocale, string[]> = {
  en: [
    "AI Development Company",
    "Artificial Intelligence Services",
    "AI Solutions Provider",
    "Custom Software Development",
    "Digital Transformation Consulting",
    "IT Consulting Services",
    "Business Automation Solutions",
    "Technology Solutions Company",
  ],
  es: [
    "Empresa de Desarrollo de IA",
    "Servicios de Inteligencia Artificial",
    "Soluciones de IA para Empresas",
    "Desarrollo de Software Personalizado",
    "Consultoría de Transformación Digital",
    "Servicios de Consultoría TI",
    "Soluciones de Automatización de Negocios",
  ],
  de: [
    "KI-Entwicklungsunternehmen",
    "Künstliche Intelligenz Dienstleistungen",
    "KI-Lösungen für Unternehmen",
    "Individuelle Softwareentwicklung",
    "Digitale Transformation Beratung",
    "IT-Beratungsdienstleistungen",
    "Geschäftsautomatisierungslösungen",
  ],
  fr: [
    "Société de Développement IA",
    "Services d'Intelligence Artificielle",
    "Solutions IA pour Entreprises",
    "Développement Logiciel Personnalisé",
    "Conseil en Transformation Digitale",
    "Services de Conseil en TI",
    "Solutions d'Automatisation des Affaires",
  ],
  it: [
    "Azienda di Sviluppo IA",
    "Servizi di Intelligenza Artificiale",
    "Soluzioni IA per Imprese",
    "Sviluppo Software Personalizzato",
    "Consulenza Trasformazione Digitale",
    "Servizi di Consulenza IT",
    "Soluzioni di Automazione Aziendale",
  ],
  nl: [
    "AI-Ontwikkelingsbedrijf",
    "Artificial Intelligence Diensten",
    "AI-Oplossingen voor Bedrijven",
    "Maatwerk Softwareontwikkeling",
    "Digitale Transformatie Consulting",
    "IT-Adviesdiensten",
    "Bedrijfsautomatisering Oplossingen",
  ],
  zh: [
    "人工智能开发公司",
    "人工智能服务",
    "企业AI解决方案",
    "定制软件开发",
    "数字化转型咨询",
    "IT咨询服务",
    "业务自动化解决方案",
  ],
  ar: [
    "شركة تطوير الذكاء الاصطناعي",
    "خدمات الذكاء الاصطناعي",
    "حلول الذكاء الاصطناعي للمؤسسات",
    "تطوير برمجيات مخصصة",
    "استشارات التحول الرقمي",
    "خدمات استشارات تقنية المعلومات",
    "حلول أتمتة الأعمال",
  ],
  fa: [
    "شرکت توسعه هوش مصنوعی",
    "خدمات هوش مصنوعی",
    "راهکارهای هوش مصنوعی سازمانی",
    "توسعه نرم‌افزار سفارشی",
    "مشاوره تحول دیجیتال",
    "خدمات مشاوره فناوری اطلاعات",
    "راهکارهای اتوماسیون کسب‌وکار",
  ],
  ps: [
    "د AI پراختیا شرکت",
    "د مصنوعي استخباراتو خدمتونه",
    "د تصدۍ لپاره د AI حل لارې",
    "دودیز سافټویر پراختیا",
    "د ډیجیټل بدلون مشوره",
    "د IT مشورتي خدمتونه",
    "د سوداګرۍ اتومات حل لارې",
  ],
};

export function getKeywords({
  locale,
  pageType,
}: {
  locale: SupportedLocale;
  pageType: string;
}): string[] {
  const primary = PRIMARY_KEYWORDS[locale] || PRIMARY_KEYWORDS.en;

  // Add page-specific keywords
  let pageSpecific: string[] = [];
  if (pageType === "home") {
    pageSpecific = ["Enterprise Technology", "AI Solutions", "Digital Transformation"];
  } else if (pageType === "about") {
    pageSpecific = ["Company Mission", "Technology Team", "Innovation"];
  } else if (pageType === "contact") {
    pageSpecific = ["Get in Touch", "Contact Sales", "AI Consultation"];
  }

  const combined = [...primary, ...pageSpecific];
  return [...new Set(combined)];
}
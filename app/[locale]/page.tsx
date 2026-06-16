// app/[locale]/page.tsx

import { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { Header } from "./_components/Header/Header";
import { FooterSection } from "./_components/Footer/FooterSections";
import HomeHero from "./_components/HomeHero/HomeHero";
import { AiShowcase } from "./_components/AiShowcase/AiShowcase";
import Script from "next/script";
import { HowItWorksWrapper } from "./_components/HowItWorksWrapper";

type Props = {
  params: Promise<{ locale: string }>;
};

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-LANGUAGE CONTENT MAP (All 10 locales)
// ─────────────────────────────────────────────────────────────────────────────

const content = {
  en: {
    title: "IDWE - Enterprise AI & Technology Services",
    description:
      "IDWE delivers AI solutions, software development, web & mobile apps, cybersecurity, API integrations, and scalable enterprise technology services.",
    servicesHeading: "Our Services",
    servicesSub:
      "We deliver AI solutions, software engineering, cybersecurity, API integrations, and enterprise-grade digital transformation services.",
  },
  es: {
    title: "IDWE - Servicios de IA y Tecnología Empresarial",
    description:
      "IDWE ofrece soluciones de IA, desarrollo de software, aplicaciones web y móviles, ciberseguridad, integraciones de API y servicios tecnológicos escalables para empresas.",
    servicesHeading: "Nuestros Servicios",
    servicesSub:
      "Ofrecemos soluciones de IA, ingeniería de software, ciberseguridad, integraciones de API y servicios de transformación digital de nivel empresarial.",
  },
  de: {
    title: "IDWE - Unternehmens-KI & Technologiedienstleistungen",
    description:
      "IDWE bietet KI-Lösungen, Softwareentwicklung, Web- und Mobile-Apps, Cybersicherheit, API-Integrationen und skalierbare Unternehmenstechnologiedienste.",
    servicesHeading: "Unsere Dienstleistungen",
    servicesSub:
      "Wir liefern KI-Lösungen, Softwareentwicklung, Cybersicherheit, API-Integrationen und digitale Transformationsdienste auf Unternehmensniveau.",
  },
  fr: {
    title: "IDWE - Services d'IA et Technologies d'Entreprise",
    description:
      "IDWE fournit des solutions d'IA, du développement logiciel, des applications web et mobiles, de la cybersécurité, des intégrations API et des services technologiques d'entreprise évolutifs.",
    servicesHeading: "Nos Services",
    servicesSub:
      "Nous fournissons des solutions d'IA, de l'ingénierie logicielle, de la cybersécurité, des intégrations API et des services de transformation digitale de niveau entreprise.",
  },
  it: {
    title: "IDWE - Servizi IA e Tecnologie per Imprese",
    description:
      "IDWE fornisce soluzioni AI, sviluppo software, app web e mobili, cybersecurity, integrazioni API e servizi tecnologici aziendali scalabili.",
    servicesHeading: "I Nostri Servizi",
    servicesSub:
      "Forniamo soluzioni AI, ingegneria del software, cybersecurity, integrazioni API e servizi di trasformazione digitale di livello enterprise.",
  },
  nl: {
    title: "IDWE - Zakelijke AI & Technologiediensten",
    description:
      "IDWE levert AI-oplossingen, softwareontwikkeling, web- en mobiele apps, cyberbeveiliging, API-integraties en schaalbare zakelijke technologiediensten.",
    servicesHeading: "Onze Diensten",
    servicesSub:
      "Wij leveren AI-oplossingen, software-engineering, cyberbeveiliging, API-integraties en digitale transformatiediensten op ondernemingsniveau.",
  },
  zh: {
    title: "IDWE - 企业级AI与技术服务",
    description:
      "IDWE 提供人工智能解决方案、软件开发、网站与移动应用、网络安全、API集成及可扩展的企业技术服务。",
    servicesHeading: "我们的服务",
    servicesSub:
      "我们提供AI解决方案、软件工程、网络安全、API集成和企业级数字化转型服务。",
  },
  ar: {
    title: "IDWE - حلول الذكاء الاصطناعي والتقنيات للمؤسسات",
    description:
      "تقدم IDWE حلول الذكاء الاصطناعي، تطوير البرمجيات، تطبيقات الويب والجوال، الأمن السيبراني، تكاملات API، وخدمات تقنية مؤسسية قابلة للتوسع.",
    servicesHeading: "خدماتنا",
    servicesSub:
      "نقدم حلول الذكاء الاصطناعي، هندسة البرمجيات، الأمن السيبراني، تكاملات API، وخدمات التحول الرقمي على مستوى المؤسسات.",
  },
  fa: {
    title: "IDWE - خدمات هوش مصنوعی و فناوری سازمانی",
    description:
      "IDWE راهکارهای هوش مصنوعی، توسعه نرم‌افزار، اپلیکیشن‌های وب و موبایل، امنیت سایبری، یکپارچه‌سازی API و خدمات فناوری سازمانی مقیاس‌پذیر ارائه می‌دهد.",
    servicesHeading: "خدمات ما",
    servicesSub:
      "ما راهکارهای هوش مصنوعی، مهندسی نرم‌افزار، امنیت سایبری، یکپارچه‌سازی API و خدمات تحول دیجیتال در سطح سازمانی ارائه می‌دهیم.",
  },
  ps: {
    title: "IDWE - د AI او تصدۍ ټکنالوژۍ خدمتونه",
    description:
      "IDWE د AI حل لارې، سافټویر پراختیا، ویب او موبایل اپلیکیشنونه، سایبري امنیت، API ادغامونه، او د تصدۍ کچې ټکنالوژۍ خدمتونه وړاندې کوي.",
    servicesHeading: "زموږ خدمتونه",
    servicesSub:
      "موږ د AI حل لارې، سافټویر انجینري، سایبري امنیت، API ادغامونه، او د ډیجیټل بدلون تصدۍ کچې خدمتونه وړاندې کوو.",
  },
} as const;

// RTL languages (same as before)
const RTL_LOCALES = ["ar", "fa", "ps"];

const BASE_URL = "https://idwe.tech";

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC METADATA GENERATION
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = content[locale as keyof typeof content] ?? content.en;

  // Build alternate languages object from the content keys
  const languages: Record<string, string> = {};
  for (const lang of Object.keys(content)) {
    languages[lang] = `${BASE_URL}/${lang}`;
  }

  const ogImage = {
    url: `${BASE_URL}/images/home-og.jpg`,
    width: 1200,
    height: 630,
    alt: t.title,
  };

  return {
    title: t.title,
    description: t.description,

    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages,
    },

    openGraph: {
      title: t.title,
      description: t.description,
      url: `${BASE_URL}/${locale}`,
      siteName: "IDWE",
      type: "website",
      locale: locale,
      images: ogImage,
    },

    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: ogImage,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    verification: {
      // Add your verification codes here if needed
      // google: "your-google-site-verification",
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT WITH STRUCTURED DATA
// ─────────────────────────────────────────────────────────────────────────────

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = content[locale as keyof typeof content] ?? content.en;
  const isRtl = RTL_LOCALES.includes(locale);

  // JSON-LD structured data for the homepage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t.title,
    description: t.description,
    url: `${BASE_URL}/${locale}`,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "IDWE",
      url: BASE_URL,
    },
    about: {
      "@type": "Organization",
      name: "IDWE",
      url: BASE_URL,
      logo: `${BASE_URL}/logo/idwe.png`,
      sameAs: [
        // Add social media URLs if available
        // "https://www.linkedin.com/company/idwe",
        // "https://twitter.com/idwe",
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "AI Solutions",
          url: `${BASE_URL}/${locale}/services/ai-solutions`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Software Development",
          url: `${BASE_URL}/${locale}/services/software-development`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Cybersecurity Services",
          url: `${BASE_URL}/${locale}/services/cybersecurity`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Digital Transformation",
          url: `${BASE_URL}/${locale}/services/digital-transformation`,
        },
      ],
    },
  };

  return (
    <>
      {/* Inject structured data */}
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div dir={isRtl ? "rtl" : "ltr"}>
        <Header />
        <HomeHero />
        <AiShowcase />
        <HowItWorksWrapper />
        <FooterSection />
      </div>
    </>
  );
}

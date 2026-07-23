// app/[locale]/page.tsx
import { Metadata } from "next";
import { HeaderWrapper } from "./_components/Header/HeaderWrapper";
import { FooterSection } from "./_components/Footer/FooterSections";
import HomeHero from "./_components/HomeHero/HomeHero";
import { AiShowcase } from "./_components/AiShowcase/AiShowcase";
import { HowItWorksWrapper } from "./_components/Wrappers/HowItWorksWrapper";
import { TechStackSection } from "./_components/Wrappers/TechStackSection";
import { ConnectedModelSection } from "./_components/Wrappers/ConnectedModelSection";
import { generatePageMetadata } from "@/lib/seo/metadata";
import {
  fetchTechnologies,
  fetchIndustries,
  fetchProcessSteps,
  fetchTestimonials,
  fetchServices,
  fetchPartners,
} from "@/lib/automex/content";
import type { SupportedLocale } from "@/lib/locale";
import { PartnersLogoGrid } from "./(routes)/partners/_components";
type Props = {
  params: Promise<{ locale: string }>;
};

// ─── Metadata ─────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    pageType: "home",
    locale: locale as any,
  });
}

// ─── Content ─────────────────────────────────────

const content = {
  en: {
    servicesHeading: "Our Services",
    servicesSub:
      "We deliver AI solutions, software engineering, and enterprise-grade digital transformation services.",
  },
  es: {
    servicesHeading: "Nuestros Servicios",
    servicesSub:
      "Ofrecemos soluciones de IA, ingeniería de software y servicios de transformación digital de nivel empresarial.",
  },
  de: {
    servicesHeading: "Unsere Dienstleistungen",
    servicesSub:
      "Wir liefern KI-Lösungen, Softwareentwicklung und digitale Transformationsdienste auf Unternehmensniveau.",
  },
  fr: {
    servicesHeading: "Nos Services",
    servicesSub:
      "Nous fournissons des solutions d'IA, de l'ingénierie logicielle et des services de transformation digitale de niveau entreprise.",
  },
  it: {
    servicesHeading: "I Nostri Servizi",
    servicesSub:
      "Forniamo soluzioni AI, ingegneria del software e servizi di trasformazione digitale di livello enterprise.",
  },
  nl: {
    servicesHeading: "Onze Diensten",
    servicesSub:
      "Wij leveren AI-oplossingen, software-engineering en digitale transformatiediensten op ondernemingsniveau.",
  },
  zh: {
    servicesHeading: "我们的服务",
    servicesSub: "我们提供AI解决方案、软件工程和企业级数字化转型服务。",
  },
  ar: {
    servicesHeading: "خدماتنا",
    servicesSub:
      "نقدم حلول الذكاء الاصطناعي، هندسة البرمجيات، وخدمات التحول الرقمي على مستوى المؤسسات.",
  },
  fa: {
    servicesHeading: "خدمات ما",
    servicesSub:
      "ما راهکارهای هوش مصنوعی، مهندسی نرم‌افزار و خدمات تحول دیجیتال در سطح سازمانی ارائه می‌دهیم.",
  },
  ps: {
    servicesHeading: "زموږ خدمتونه",
    servicesSub:
      "موږ د AI حل لارې، سافټویر انجینري او د ډیجیټل بدلون تصدۍ کچې خدمتونه وړاندې کوو.",
  },
} as const;

// ─── Page ─────────────────────────────────────────

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const lang = locale as SupportedLocale;
  const t = content[locale as keyof typeof content] ?? content.en;
  const isRtl = ["ar", "fa", "ps"].includes(locale);

  // Fetch live data for key homepage sections.
  // Swallow errors during static generation so the build succeeds
  // even when the backend isn't reachable (e.g. CI without Django).
  const safeFetch = async <T,>(p: Promise<T>): Promise<T | undefined> => {
    try {
      return await p;
    } catch {
      return undefined;
    }
  };

  const [
    technologies,
    industries,
    processSteps,
    testimonials,
    featuredServices,
    partners,
  ] = await Promise.all([
    safeFetch(fetchTechnologies(undefined, lang)),
    safeFetch(fetchIndustries(lang)),
    safeFetch(fetchProcessSteps(lang)),
    safeFetch(fetchTestimonials({ is_featured: true }, lang)),
    safeFetch(fetchServices({ is_featured: true, page: 1 }, lang)),
    safeFetch(fetchPartners({}, lang)),
  ]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <HeaderWrapper locale={locale} />
      <HomeHero />
      <div className="mx-auto max-w-7xl px-4">

      {partners && partners.length > 0 && (
        <PartnersLogoGrid
          partners={partners}
          title="Trusted by"
          maxLogos={6}
        />
      )}
      </div>
      <AiShowcase />
      <HowItWorksWrapper liveProcessSteps={processSteps} />
      <TechStackSection isRtl={isRtl} liveTechnologies={technologies} />
      <ConnectedModelSection isRtl={isRtl} liveTestimonials={testimonials} />
      <FooterSection />
    </div>
  );
}

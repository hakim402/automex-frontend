// lib/seo/metadata.ts
import { Metadata } from "next";
import { SeoMetadataOptions, PageType } from "./types";
import { getAlternates } from "./alternates";
import { getKeywords } from "./keywords";
import { getOgLocale, SupportedLocale } from "@/lib/locale";

const BASE_URL = "https://automex.tech";

const titleTemplates: Record<PageType, Record<SupportedLocale, string>> = {
  home: {
    en: "AUTOMEX - AI Solutions, Software Development & Digital Transformation",
    es: "AUTOMEX - Soluciones de IA, Desarrollo de Software y Transformación Digital",
    de: "AUTOMEX - KI-Lösungen, Softwareentwicklung & Digitale Transformation",
    fr: "AUTOMEX - Solutions IA, Développement Logiciel & Transformation Digitale",
    it: "AUTOMEX - Soluzioni IA, Sviluppo Software & Trasformazione Digitale",
    nl: "AUTOMEX - AI Oplossingen, Softwareontwikkeling & Digitale Transformatie",
    zh: "AUTOMEX - AI解决方案、软件开发与数字化转型",
    ar: "AUTOMEX - حلول الذكاء الاصطناعي وتطوير البرمجيات والتحول الرقمي",
    fa: "AUTOMEX - راهکارهای هوش مصنوعی، توسعه نرم‌افزار و تحول دیجیتال",
    ps: "AUTOMEX - AI حل لارې، سافټویر پراختیا او ډیجیټل بدلون",
  },
  about: {
    en: "About AUTOMEX - AI & Technology Solutions Company",
    es: "Sobre AUTOMEX - Empresa de Soluciones de IA y Tecnología",
    de: "Über AUTOMEX - KI- und Technologielösungen Unternehmen",
    fr: "À Propos d'AUTOMEX - Entreprise de Solutions IA et Technologie",
    it: "Chi Siamo AUTOMEX - Azienda di Soluzioni IA e Tecnologia",
    nl: "Over AUTOMEX - AI- en Technologieoplossingen Bedrijf",
    zh: "关于AUTOMEX - AI与技术解决方案公司",
    ar: "حول AUTOMEX - شركة حلول الذكاء الاصطناعي والتكنولوجيا",
    fa: "درباره AUTOMEX - شرکت راهکارهای هوش مصنوعی و فناوری",
    ps: "د AUTOMEX په اړه - د AI او ټکنالوژۍ حل لارې شرکت",
  },
  contact: {
    en: "Contact AUTOMEX - Get in Touch with Our Team",
    es: "Contacta AUTOMEX - Ponte en Contacto con Nuestro Equipo",
    de: "Kontakt AUTOMEX - Nehmen Sie Kontakt mit Unserem Team auf",
    fr: "Contact AUTOMEX - Prenez Contact avec Notre Équipe",
    it: "Contatta AUTOMEX - Mettiti in Contatto con il Nostro Team",
    nl: "Contact AUTOMEX - Neem Contact Op met Ons Team",
    zh: "联系AUTOMEX - 与我们的团队取得联系",
    ar: "اتصل بـ AUTOMEX - تواصل مع فريقنا",
    fa: "تماس با AUTOMEX - با تیم ما در تماس باشید",
    ps: "د AUTOMEX سره اړیکه - زموږ ټیم سره اړیکه ونیسئ",
  },
};

const defaultDescriptions: Record<PageType, Record<SupportedLocale, string>> = {
  home: {
    en: "AUTOMEX delivers AI solutions, custom software development, web & mobile apps, and digital transformation services to help businesses scale and innovate.",
    es: "AUTOMEX ofrece soluciones de IA, desarrollo de software personalizado, aplicaciones web y móviles, y servicios de transformación digital para ayudar a las empresas a escalar e innovar.",
    de: "AUTOMEX bietet KI-Lösungen, individuelle Softwareentwicklung, Web- und Mobile-Apps sowie digitale Transformationsdienste, um Unternehmen bei der Skalierung und Innovation zu helfen.",
    fr: "AUTOMEX fournit des solutions IA, du développement logiciel personnalisé, des applications web et mobiles, et des services de transformation digitale pour aider les entreprises à évoluer et innover.",
    it: "AUTOMEX fornisce soluzioni IA, sviluppo software personalizzato, app web e mobili, e servizi di trasformazione digitale per aiutare le aziende a crescere e innovare.",
    nl: "AUTOMEX biedt AI-oplossingen, maatwerk softwareontwikkeling, web- en mobiele apps, en digitale transformatiediensten om bedrijven te helpen schalen en innoveren.",
    zh: "AUTOMEX提供AI解决方案、定制软件开发、网站与移动应用，以及数字化转型服务，帮助企业扩展和创新。",
    ar: "تقدم AUTOMEX حلول الذكاء الاصطناعي، وتطوير البرمجيات المخصصة، وتطبيقات الويب والجوال، وخدمات التحول الرقمي لمساعدة الشركات على النمو والابتكار.",
    fa: "AUTOMEX راهکارهای هوش مصنوعی، توسعه نرم‌افزار سفارشی، اپلیکیشن‌های وب و موبایل، و خدمات تحول دیجیتال را برای کمک به کسب‌وکارها در رشد و نوآوری ارائه می‌دهد.",
    ps: "AUTOMEX د AI حل لارې، دودیز سافټویر پراختیا، ویب او موبایل اپلیکیشنونه، او د ډیجیټل بدلون خدمتونه وړاندې کوي ترڅو سوداګرۍ ته د ودې او نوښت په برخه کې مرسته وکړي.",
  },
  about: {
    en: "Learn about AUTOMEX - our mission, values, and how we help businesses transform through AI, software, and technology solutions.",
    es: "Conoce AUTOMEX - nuestra misión, valores, y cómo ayudamos a las empresas a transformarse a través de soluciones de IA, software y tecnología.",
    de: "Erfahren Sie mehr über AUTOMEX - unsere Mission, Werte und wie wir Unternehmen durch KI-, Software- und Technologielösungen bei der Transformation helfen.",
    fr: "Découvrez AUTOMEX - notre mission, nos valeurs, et comment nous aidons les entreprises à se transformer grâce aux solutions IA, logiciels et technologies.",
    it: "Scopri AUTOMEX - la nostra missione, i nostri valori e come aiutiamo le aziende a trasformarsi attraverso soluzioni IA, software e tecnologia.",
    nl: "Leer AUTOMEX kennen - onze missie, waarden en hoe we bedrijven helpen transformeren door AI-, software- en technologieoplossingen.",
    zh: "了解AUTOMEX - 我们的使命、价值观，以及我们如何通过AI、软件和技术解决方案帮助企业转型。",
    ar: "تعرف على AUTOMEX - مهمتنا وقيمنا، وكيف نساعد الشركات على التحول من خلال حلول الذكاء الاصطناعي والبرمجيات والتكنولوجيا.",
    fa: "با AUTOMEX آشنا شوید - مأموریت، ارزش‌ها، و نحوه کمک ما به کسب‌وکارها برای تحول از طریق راهکارهای هوش مصنوعی، نرم‌افزار و فناوری.",
    ps: "د AUTOMEX په اړه زده کړئ - زموږ ماموریت، ارزښتونه، او څنګه موږ د AI، سافټویر او ټکنالوژۍ حل لارو له لارې سوداګرۍ سره بدلون کې مرسته کوو.",
  },
  contact: {
    en: "Contact AUTOMEX for AI solutions, software development, and digital transformation services. Get in touch with our team today.",
    es: "Contacta AUTOMEX para soluciones de IA, desarrollo de software y servicios de transformación digital. Ponte en contacto con nuestro equipo hoy.",
    de: "Kontaktieren Sie AUTOMEX für KI-Lösungen, Softwareentwicklung und digitale Transformationsdienste. Nehmen Sie noch heute Kontakt mit unserem Team auf.",
    fr: "Contactez AUTOMEX pour des solutions IA, du développement logiciel et des services de transformation digitale. Prenez contact avec notre équipe aujourd'hui.",
    it: "Contatta AUTOMEX per soluzioni IA, sviluppo software e servizi di trasformazione digitale. Mettiti in contatto con il nostro team oggi.",
    nl: "Contact AUTOMEX voor AI-oplossingen, softwareontwikkeling en digitale transformatiediensten. Neem vandaag nog contact op met ons team.",
    zh: "联系AUTOMEX获取AI解决方案、软件开发和数字化转型服务。今天就与我们的团队取得联系。",
    ar: "اتصل بـ AUTOMEX للحصول على حلول الذكاء الاصطناعي، تطوير البرمجيات، وخدمات التحول الرقمي. تواصل مع فريقنا اليوم.",
    fa: "برای راهکارهای هوش مصنوعی، توسعه نرم‌افزار و خدمات تحول دیجیتال با AUTOMEX تماس بگیرید. امروز با تیم ما در تماس باشید.",
    ps: "د AI حل لارو، سافټویر پراختیا او ډیجیټل بدلون خدمتونو لپاره د AUTOMEX سره اړیکه ونیسئ. نن ورځ زموږ ټیم سره اړیکه ونیسئ.",
  },
};

export function generatePageMetadata(options: SeoMetadataOptions): Metadata {
  const {
    pageType,
    locale,
    pathSegment,
    customTitle,
    customDescription,
    ogImageUrl,
    ogImageAlt,
    noIndex = false,
  } = options;

  const titleTemplate = titleTemplates[pageType]?.[locale as SupportedLocale] || titleTemplates.home.en;
  const descriptionTemplate = defaultDescriptions[pageType]?.[locale as SupportedLocale] || defaultDescriptions.home.en;

  let title = customTitle || titleTemplate;
  let description = customDescription || descriptionTemplate;

  const keywords = getKeywords({
    locale: locale as SupportedLocale,
    pageType,
  });

  const alternates = getAlternates({
    locale: locale as SupportedLocale,
    pathSegment,
  });

  const image = ogImageUrl || `${BASE_URL}/logo/automex.png`;
  const imageAlt = ogImageAlt || title;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}${pathSegment ? `/${pathSegment}` : ""}`,
      siteName: "AUTOMEX",
      locale: getOgLocale(locale),
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  };
}
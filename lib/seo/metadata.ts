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
    zh: "AUTOMEX - AI解决方案、软件开发与数字化转型",
    ar: "AUTOMEX - حلول الذكاء الاصطناعي وتطوير البرمجيات والتحول الرقمي",
  },
  about: {
    en: "About AUTOMEX - AI & Technology Solutions Company",
    es: "Sobre AUTOMEX - Empresa de Soluciones de IA y Tecnología",
    de: "Über AUTOMEX - KI- und Technologielösungen Unternehmen",
    fr: "À Propos d'AUTOMEX - Entreprise de Solutions IA et Technologie",
    zh: "关于AUTOMEX - AI与技术解决方案公司",
    ar: "حول AUTOMEX - شركة حلول الذكاء الاصطناعي والتكنولوجيا",
  },
  contact: {
    en: "Contact AUTOMEX - Get in Touch with Our Team",
    es: "Contacta AUTOMEX - Ponte en Contacto con Nuestro Equipo",
    de: "Kontakt AUTOMEX - Nehmen Sie Kontakt mit Unserem Team auf",
    fr: "Contact AUTOMEX - Prenez Contact avec Notre Équipe",
    zh: "联系AUTOMEX - 与我们的团队取得联系",
    ar: "اتصل بـ AUTOMEX - تواصل مع فريقنا",
  },
  crm: {
    en: "CRM Overview – AUTOMEX Customer Management",
    es: "CRM – AUTOMEX Gestión de Clientes",
    de: "CRM-Übersicht – AUTOMEX Kundenmanagement",
    fr: "Aperçu CRM – AUTOMEX Gestion de la Clientèle",
    zh: "CRM总览 – AUTOMEX 客户管理",
    ar: "نظرة عامة على CRM – AUTOMEX إدارة العملاء",
  },
  bookCall: {
    en: "Book a Call – AUTOMEX Free Consultation",
    es: "Reservar una Llamada – AUTOMEX Consulta Gratuita",
    de: "Gespräch buchen – AUTOMEX Kostenlose Beratung",
    fr: "Réserver un Appel – AUTOMEX Consultation Gratuite",
    zh: "预约通话 – AUTOMEX 免费咨询",
    ar: "احجز مكالمة – AUTOMEX استشارة مجانية",
  },
  contactSales: {
    en: "Contact Sales – AUTOMEX Enterprise Sales",
    es: "Contactar Ventas – AUTOMEX Ventas Empresariales",
    de: "Vertrieb kontaktieren – AUTOMEX Enterprise Sales",
    fr: "Contacter les Ventes – AUTOMEX Ventes Entreprise",
    zh: "联系销售 – AUTOMEX 企业销售",
    ar: "اتصل بالمبيعات – AUTOMEX مبيعات الشركات",
  },
  quote: {
    en: "Request a Quote – AUTOMEX AI & Development",
    es: "Solicitar Presupuesto – AUTOMEX IA y Desarrollo",
    de: "Angebot anfordern – AUTOMEX KI & Entwicklung",
    fr: "Demander un Devis – AUTOMEX IA & Développement",
    zh: "请求报价 – AUTOMEX AI与开发",
    ar: "طلب عرض سعر – AUTOMEX الذكاء الاصطناعي والتطوير",
  },
  services: {
    en: "Services – AUTOMEX AI, Software & Digital Transformation",
    es: "Servicios – AUTOMEX IA, Software y Transformación Digital",
    de: "Dienstleistungen – AUTOMEX KI, Software & Digitale Transformation",
    fr: "Services – AUTOMEX IA, Logiciel & Transformation Digitale",
    zh: "服务 – AUTOMEX AI、软件与数字化转型",
    ar: "الخدمات – AUTOMEX الذكاء الاصطناعي والبرمجيات والتحول الرقمي",
  },
  serviceDetail: {
    en: "AUTOMEX – AI & Software Development Service",
    es: "AUTOMEX – Servicio de Desarrollo de IA y Software",
    de: "AUTOMEX – KI- und Softwareentwicklungsdienst",
    fr: "AUTOMEX – Service de Développement IA et Logiciel",
    zh: "AUTOMEX – AI与软件开发服务",
    ar: "AUTOMEX – خدمة تطوير الذكاء الاصطناعي والبرمجيات",
  },
  techExpertise: {
    en: "Tech Expertise – AUTOMEX Technology Capabilities & Stack",
    es: "Experiencia Técnica – AUTOMEX Capacidades y Stack Tecnológico",
    de: "Tech-Expertise – AUTOMEX Technologiefähigkeiten & Stack",
    fr: "Expertise Technique – AUTOMEX Capacités et Stack Technologique",
    zh: "技术专长 – AUTOMEX 技术能力与技术栈",
    ar: "الخبرة التقنية – AUTOMEX قدرات ومكدس التكنولوجيا",
  },
  techExpertiseDetail: {
    en: "AUTOMEX – Tech Expertise",
    es: "AUTOMEX – Experiencia Técnica",
    de: "AUTOMEX – Tech-Expertise",
    fr: "AUTOMEX – Expertise Technique",
    zh: "AUTOMEX – 技术专长",
    ar: "AUTOMEX – الخبرة التقنية",
  },
  industries: {
    en: "Industries – AUTOMEX AI & Technology Solutions by Sector",
    es: "Industrias – AUTOMEX Soluciones de IA y Tecnología por Sector",
    de: "Branchen – AUTOMEX KI- & Technologielösungen nach Sektor",
    fr: "Industries – AUTOMEX Solutions IA & Technologie par Secteur",
    zh: "行业 – AUTOMEX 各行业AI与技术解决方案",
    ar: "الصناعات – AUTOMEX حلول الذكاء الاصطناعي والتكنولوجيا حسب القطاع",
  },
  industryDetail: {
    en: "AUTOMEX – Industry Technology Solutions",
    es: "AUTOMEX – Soluciones Tecnológicas para la Industria",
    de: "AUTOMEX – Technologielösungen für die Branche",
    fr: "AUTOMEX – Solutions Technologiques pour l'Industrie",
    zh: "AUTOMEX – 行业技术解决方案",
    ar: "AUTOMEX – حلول تقنية للصناعة",
  },
  aiCapabilities: {
    en: "AI Capabilities – AUTOMEX Artificial Intelligence Solutions",
    es: "Capacidades de IA – AUTOMEX Soluciones de Inteligencia Artificial",
    de: "KI-Fähigkeiten – AUTOMEX Lösungen für Künstliche Intelligenz",
    fr: "Capacités IA – AUTOMEX Solutions d'Intelligence Artificielle",
    zh: "AI能力 – AUTOMEX 人工智能解决方案",
    ar: "قدرات الذكاء الاصطناعي – AUTOMEX حلول الذكاء الاصطناعي",
  },
  aiCapabilityDetail: {
    en: "AUTOMEX – AI Capability",
    es: "AUTOMEX – Capacidad de IA",
    de: "AUTOMEX – KI-Fähigkeit",
    fr: "AUTOMEX – Capacité IA",
    zh: "AUTOMEX – AI能力",
    ar: "AUTOMEX – قدرة الذكاء الاصطناعي",
  },
  caseStudies: {
    en: "Case Studies – AUTOMEX Success Stories & Client Projects",
    es: "Casos de Estudio – AUTOMEX Historias de Éxito y Proyectos de Clientes",
    de: "Fallstudien – AUTOMEX Erfolgsgeschichten & Kundenprojekte",
    fr: "Études de Cas – AUTOMEX Histoires de Réussite et Projets Clients",
    zh: "案例研究 – AUTOMEX 成功案例与客户项目",
    ar: "دراسات الحالة – AUTOMEX قصص نجاح ومشاريع العملاء",
  },
  caseStudyDetail: {
    en: "AUTOMEX – Case Study",
    es: "AUTOMEX – Caso de Estudio",
    de: "AUTOMEX – Fallstudie",
    fr: "AUTOMEX – Étude de Cas",
    zh: "AUTOMEX – 案例研究",
    ar: "AUTOMEX – دراسة حالة",
  },
  portfolio: {
    en: "Portfolio – AUTOMEX Projects, Case Studies & Client Work",
    es: "Portafolio – AUTOMEX Proyectos, Casos de Estudio y Trabajo con Clientes",
    de: "Portfolio – AUTOMEX Projekte, Fallstudien & Kundenarbeiten",
    fr: "Portfolio – AUTOMEX Projets, Études de Cas & Travaux Clients",
    zh: "作品集 – AUTOMEX 项目、案例研究与客户作品",
    ar: "المحفظة – AUTOMEX مشاريع ودراسات حالة وأعمال العملاء",
  },
  portfolioDetail: {
    en: "AUTOMEX – Portfolio Project",
    es: "AUTOMEX – Proyecto del Portafolio",
    de: "AUTOMEX – Portfolio-Projekt",
    fr: "AUTOMEX – Projet du Portfolio",
    zh: "AUTOMEX – 作品集项目",
    ar: "AUTOMEX – مشروع المحفظة",
  },
  blog: {
    en: "Blog – AUTOMEX Insights on AI, Software & Technology",
    es: "Blog – AUTOMEX Información sobre IA, Software y Tecnología",
    de: "Blog – AUTOMEX Einblicke in KI, Software & Technologie",
    fr: "Blog – AUTOMEX Aperçus sur l'IA, les Logiciels et la Technologie",
    zh: "博客 – AUTOMEX AI、软件与技术洞察",
    ar: "المدونة – AUTOMEX رؤى حول الذكاء الاصطناعي والبرمجيات والتكنولوجيا",
  },
  blogDetail: {
    en: "AUTOMEX Blog",
    es: "Blog de AUTOMEX",
    de: "AUTOMEX Blog",
    fr: "Blog AUTOMEX",
    zh: "AUTOMEX 博客",
    ar: "مدونة AUTOMEX",
  },
  privacy: {
    en: "Privacy Policy – AUTOMEX",
    es: "Política de Privacidad – AUTOMEX",
    de: "Datenschutzerklärung – AUTOMEX",
    fr: "Politique de Confidentialité – AUTOMEX",
    zh: "隐私政策 – AUTOMEX",
    ar: "سياسة الخصوصية – AUTOMEX",
  },
  terms: {
    en: "Terms of Service – AUTOMEX",
    es: "Términos de Servicio – AUTOMEX",
    de: "Nutzungsbedingungen – AUTOMEX",
    fr: "Conditions d'Utilisation – AUTOMEX",
    zh: "服务条款 – AUTOMEX",
    ar: "شروط الخدمة – AUTOMEX",
  },
};

const defaultDescriptions: Record<PageType, Record<SupportedLocale, string>> = {
  home: {
    en: "AUTOMEX delivers AI solutions, custom software development, web & mobile apps, and digital transformation services to help businesses scale and innovate.",
    es: "AUTOMEX ofrece soluciones de IA, desarrollo de software personalizado, aplicaciones web y móviles, y servicios de transformación digital para ayudar a las empresas a escalar e innovar.",
    de: "AUTOMEX bietet KI-Lösungen, individuelle Softwareentwicklung, Web- und Mobile-Apps sowie digitale Transformationsdienste, um Unternehmen bei der Skalierung und Innovation zu helfen.",
    fr: "AUTOMEX fournit des solutions IA, du développement logiciel personnalisé, des applications web et mobiles, et des services de transformation digitale pour aider les entreprises à évoluer et innover.",
    zh: "AUTOMEX提供AI解决方案、定制软件开发、网站与移动应用，以及数字化转型服务，帮助企业扩展和创新。",
    ar: "تقدم AUTOMEX حلول الذكاء الاصطناعي، وتطوير البرمجيات المخصصة، وتطبيقات الويب والجوال، وخدمات التحول الرقمي لمساعدة الشركات على النمو والابتكار.",
  },
  about: {
    en: "Learn about AUTOMEX - our mission, values, and how we help businesses transform through AI, software, and technology solutions.",
    es: "Conoce AUTOMEX - nuestra misión, valores, y cómo ayudamos a las empresas a transformarse a través de soluciones de IA, software y tecnología.",
    de: "Erfahren Sie mehr über AUTOMEX - unsere Mission, Werte und wie wir Unternehmen durch KI-, Software- und Technologielösungen bei der Transformation helfen.",
    fr: "Découvrez AUTOMEX - notre mission, nos valeurs, et comment nous aidons les entreprises à se transformer grâce aux solutions IA, logiciels et technologies.",
    zh: "了解AUTOMEX - 我们的使命、价值观，以及我们如何通过AI、软件和技术解决方案帮助企业转型。",
    ar: "تعرف على AUTOMEX - مهمتنا وقيمنا، وكيف نساعد الشركات على التحول من خلال حلول الذكاء الاصطناعي والبرمجيات والتكنولوجيا.",
  },
  contact: {
    en: "Contact AUTOMEX for AI solutions, software development, and digital transformation services. Get in touch with our team today.",
    es: "Contacta AUTOMEX para soluciones de IA, desarrollo de software y servicios de transformación digital. Ponte en contacto con nuestro equipo hoy.",
    de: "Kontaktieren Sie AUTOMEX für KI-Lösungen, Softwareentwicklung und digitale Transformationsdienste. Nehmen Sie noch heute Kontakt mit unserem Team auf.",
    fr: "Contactez AUTOMEX pour des solutions IA, du développement logiciel et des services de transformation digitale. Prenez contact avec notre équipe aujourd'hui.",
    zh: "联系AUTOMEX获取AI解决方案、软件开发和数字化转型服务。今天就与我们的团队取得联系。",
    ar: "اتصل بـ AUTOMEX للحصول على حلول الذكاء الاصطناعي، تطوير البرمجيات، وخدمات التحول الرقمي. تواصل مع فريقنا اليوم.",
  },
  crm: {
    en: "Manage leads, automate follow‑ups, and track customer interactions with AUTOMEX CRM. Streamline your sales process and grow your business.",
    es: "Gestione clientes potenciales, automatice seguimientos y realice un seguimiento de las interacciones con los clientes con el CRM de AUTOMEX. Optimice su proceso de ventas y haga crecer su negocio.",
    de: "Verwalten Sie Leads, automatisieren Sie Follow‑ups und verfolgen Sie Kundeninteraktionen mit AUTOMEX CRM. Optimieren Sie Ihren Verkaufsprozess und wachsen Sie Ihr Geschäft.",
    fr: "Gérez vos prospects, automatisez les relances et suivez les interactions clients avec le CRM AUTOMEX. Rationalisez votre processus de vente et développez votre entreprise.",
    zh: "使用AUTOMEX CRM管理潜在客户、自动跟进并跟踪客户互动。优化销售流程，助您业务增长。",
    ar: "إدارة العملاء المحتملين، وأتمتة المتابعات، وتتبع تفاعلات العملاء مع AUTOMEX CRM. تبسيط عملية البيع وتنمية أعمالك.",
  },
  bookCall: {
    en: "Schedule a free consultation with our AI experts. Discuss your project, explore possibilities, and get a personalised roadmap from AUTOMEX.",
    es: "Programe una consulta gratuita con nuestros expertos en IA. Discuta su proyecto, explore posibilidades y obtenga una hoja de ruta personalizada de AUTOMEX.",
    de: "Vereinbaren Sie ein kostenloses Beratungsgespräch mit unseren KI-Experten. Besprechen Sie Ihr Projekt, entdecken Sie Möglichkeiten und erhalten Sie eine persönliche Roadmap von AUTOMEX.",
    fr: "Planifiez une consultation gratuite avec nos experts en IA. Discutez de votre projet, explorez les possibilités et obtenez une feuille de route personnalisée d’AUTOMEX.",
    zh: "与我们的AI专家预约免费咨询。讨论您的项目，探索可能性，并获得AUTOMEX的个性化路线图。",
    ar: "حدد موعدًا لاستشارة مجانية مع خبراء الذكاء الاصطناعي لدينا. ناقش مشروعك، واستكشف الاحتمالات، واحصل على خارطة طريق مخصصة من AUTOMEX.",
  },
  contactSales: {
    en: "Get in touch with our sales team for enterprise‑grade AI solutions, custom software, and digital transformation services. We'll help you find the right package.",
    es: "Póngase en contacto con nuestro equipo de ventas para soluciones de IA de nivel empresarial, software personalizado y servicios de transformación digital. Le ayudaremos a encontrar el paquete adecuado.",
    de: "Kontaktieren Sie unser Vertriebsteam für KI-Lösungen auf Unternehmensniveau, maßgeschneiderte Software und digitale Transformationsdienste. Wir helfen Ihnen, das passende Paket zu finden.",
    fr: "Contactez notre équipe commerciale pour des solutions IA de niveau entreprise, des logiciels sur mesure et des services de transformation digitale. Nous vous aiderons à trouver le bon package.",
    zh: "联系我们的销售团队，获取企业级AI解决方案、定制软件和数字化转型服务。我们将帮助您找到合适的方案。",
    ar: "تواصل مع فريق المبيعات لدينا للحصول على حلول ذكاء اصطناعي على مستوى المؤسسات، وبرمجيات مخصصة، وخدمات التحول الرقمي. سنساعدك في العثور على الباقة المناسبة.",
  },
  quote: {
    en: "Tell us about your project and receive a detailed, no‑obligation quote from AUTOMEX. We'll analyse your requirements and provide a transparent cost breakdown.",
    es: "Cuéntenos sobre su proyecto y reciba un presupuesto detallado y sin compromiso de AUTOMEX. Analizaremos sus requisitos y le proporcionaremos un desglose de costes transparente.",
    de: "Erzählen Sie uns von Ihrem Projekt und erhalten Sie ein detailliertes, unverbindliches Angebot von AUTOMEX. Wir analysieren Ihre Anforderungen und erstellen eine transparente Kostenaufstellung.",
    fr: "Parlez-nous de votre projet et recevez un devis détaillé et sans engagement d'AUTOMEX. Nous analyserons vos besoins et vous fournirons une répartition transparente des coûts.",
    zh: "告诉我们您的项目，即可获得AUTOMEX提供的详细、无义务报价。我们将分析您的需求并提供透明的费用明细。",
    ar: "أخبرنا عن مشروعك واحصل على عرض سعر مفصل وغير ملزم من AUTOMEX. سنقوم بتحليل متطلباتك وتزويدك بتفصيل شفاف للتكاليف.",
  },
  services: {
    en: "Explore AUTOMEX services — AI-powered software development, web & mobile apps, cloud solutions, and digital transformation consulting.",
    es: "Explore los servicios de AUTOMEX — desarrollo de software impulsado por IA, aplicaciones web y móviles, soluciones en la nube y consultoría de transformación digital.",
    de: "Entdecken Sie AUTOMEX-Dienste — KI-gestützte Softwareentwicklung, Web- und Mobile-Apps, Cloud-Lösungen und Beratung zur digitalen Transformation.",
    fr: "Découvrez les services AUTOMEX — développement logiciel alimenté par l'IA, applications web et mobiles, solutions cloud et conseil en transformation digitale.",
    zh: "探索AUTOMEX服务——AI驱动的软件开发、网页与移动应用、云解决方案和数字化转型咨询。",
    ar: "استكشف خدمات AUTOMEX — تطوير البرمجيات المدعوم بالذكاء الاصطناعي، وتطبيقات الويب والجوال، والحلول السحابية، واستشارات التحول الرقمي.",
  },
  serviceDetail: {
    en: "Learn more about this AUTOMEX service — AI-driven development, expert delivery, and tailored technology solutions for your business.",
    es: "Obtenga más información sobre este servicio de AUTOMEX — desarrollo impulsado por IA, entrega experta y soluciones tecnológicas a medida para su negocio.",
    de: "Erfahren Sie mehr über diesen AUTOMEX-Dienst — KI-gesteuerte Entwicklung, fachkundige Lieferung und maßgeschneiderte Technologielösungen für Ihr Unternehmen.",
    fr: "En savoir plus sur ce service AUTOMEX — développement piloté par l'IA, livraison experte et solutions technologiques sur mesure pour votre entreprise.",
    zh: "了解更多关于此AUTOMEX服务——AI驱动开发、专业交付以及为您的企业量身定制的技术解决方案。",
    ar: "تعرف على المزيد حول خدمة AUTOMEX هذه — تطوير مدعوم بالذكاء الاصطناعي، وتسليم خبير، وحلول تقنية مخصصة لعملك.",
  },
  techExpertise: {
    en: "Explore AUTOMEX technology expertise across architecture, cloud, AI, data engineering, DevOps, mobile, security, and QA — the full stack skills behind every successful project.",
    es: "Explore la experiencia tecnológica de AUTOMEX en arquitectura, cloud, IA, ingeniería de datos, DevOps, móvil, seguridad y QA — las habilidades de stack completo detrás de cada proyecto exitoso.",
    de: "Entdecken Sie die Technologie-Expertise von AUTOMEX in Architektur, Cloud, KI, Data Engineering, DevOps, Mobile, Sicherheit und QA — die Full-Stack-Fähigkeiten hinter jedem erfolgreichen Projekt.",
    fr: "Explorez l'expertise technologique d'AUTOMEX en architecture, cloud, IA, ingénierie des données, DevOps, mobile, sécurité et QA — les compétences full-stack derrière chaque projet réussi.",
    zh: "探索AUTOMEX在架构、云、AI、数据工程、DevOps、移动、安全和QA方面的技术专长——每个成功项目背后的全栈技能。",
    ar: "استكشف خبرة AUTOMEX التقنية في الهندسة المعمارية والسحابة والذكاء الاصطناعي وهندسة البيانات وDevOps والجوال والأمان وضمان الجودة — المهارات الكاملة وراء كل مشروع ناجح.",
  },
  techExpertiseDetail: {
    en: "Learn about this AUTOMEX technology expertise area — the tools, frameworks, and methodologies we use to deliver production-grade software and infrastructure.",
    es: "Conozca esta área de experiencia tecnológica de AUTOMEX — las herramientas, frameworks y metodologías que utilizamos para entregar software e infraestructura de nivel de producción.",
    de: "Erfahren Sie mehr über diesen Technologie-Expertisebereich von AUTOMEX — die Tools, Frameworks und Methoden, mit denen wir produktionsreife Software und Infrastruktur liefern.",
    fr: "Découvrez ce domaine d'expertise technologique d'AUTOMEX — les outils, frameworks et méthodologies que nous utilisons pour livrer des logiciels et une infrastructure de qualité production.",
    zh: "了解AUTOMEX的这项技术专长领域——我们用于交付生产级软件和基础设施的工具、框架和方法论。",
    ar: "تعرف على مجال الخبرة التقنية هذا من AUTOMEX — الأدوات والأطر والمنهجيات التي نستخدمها لتقديم برمجيات وبنية تحتية على مستوى الإنتاج.",
  },
  industries: {
    en: "Explore AUTOMEX industry expertise across healthcare, e-commerce, SaaS, and more. Tailored AI and technology solutions for every sector.",
    es: "Explore la experiencia industrial de AUTOMEX en salud, comercio electrónico, SaaS y más. Soluciones de IA y tecnología adaptadas a cada sector.",
    de: "Entdecken Sie die Branchenexpertise von AUTOMEX in Gesundheitswesen, E-Commerce, SaaS und mehr. Maßgeschneiderte KI- und Technologielösungen für jede Branche.",
    fr: "Explorez l'expertise sectorielle d'AUTOMEX dans la santé, le e-commerce, le SaaS et plus encore. Solutions IA et technologiques adaptées à chaque secteur.",
    zh: "探索AUTOMEX在医疗、电子商务、SaaS等领域的行业专长。为每个行业量身定制的AI和技术解决方案。",
    ar: "استكشف خبرة AUTOMEX الصناعية في الرعاية الصحية والتجارة الإلكترونية وSaaS والمزيد. حلول الذكاء الاصطناعي والتكنولوجيا المصممة لكل قطاع.",
  },
  industryDetail: {
    en: "Learn how AUTOMEX delivers AI and software solutions for this industry — tailored technology, compliance expertise, and proven results.",
    es: "Descubra cómo AUTOMEX ofrece soluciones de IA y software para esta industria — tecnología a medida, experiencia en cumplimiento y resultados comprobados.",
    de: "Erfahren Sie, wie AUTOMEX KI- und Softwarelösungen für diese Branche liefert — maßgeschneiderte Technologie, Compliance-Expertise und bewährte Ergebnisse.",
    fr: "Découvrez comment AUTOMEX fournit des solutions IA et logicielles pour cette industrie — technologie sur mesure, expertise en conformité et résultats éprouvés.",
    zh: "了解AUTOMEX如何为该行业提供AI和软件解决方案——定制技术、合规专业知识和经证实的成果。",
    ar: "تعرف على كيفية تقديم AUTOMEX لحلول الذكاء الاصطناعي والبرمجيات لهذه الصناعة — تقنية مخصصة وخبرة في الامتثال ونتائج مثبتة.",
  },
  aiCapabilities: {
    en: "Explore AUTOMEX AI capabilities — NLP, Computer Vision, Generative AI, Predictive Analytics, MLOps, RAG agents, and intelligent automation.",
    es: "Explore las capacidades de IA de AUTOMEX — NLP, Visión por Computadora, IA Generativa, Analítica Predictiva, MLOps, agentes RAG y automatización inteligente.",
    de: "Entdecken Sie die KI-Fähigkeiten von AUTOMEX — NLP, Computer Vision, generative KI, prädiktive Analytik, MLOps, RAG-Agenten und intelligente Automatisierung.",
    fr: "Explorez les capacités IA d'AUTOMEX — NLP, vision par ordinateur, IA générative, analytique prédictive, MLOps, agents RAG et automatisation intelligente.",
    zh: "探索AUTOMEX的AI能力——NLP、计算机视觉、生成式AI、预测分析、MLOps、RAG代理和智能自动化。",
    ar: "استكشف قدرات الذكاء الاصطناعي لدى AUTOMEX — معالجة اللغة الطبيعية، الرؤية الحاسوبية، الذكاء الاصطناعي التوليدي، التحليلات التنبؤية، MLOps، وكلاء RAG، والأتمتة الذكية.",
  },
  aiCapabilityDetail: {
    en: "Learn about this AUTOMEX AI capability — how we apply cutting-edge artificial intelligence to solve real-world business challenges.",
    es: "Conozca esta capacidad de IA de AUTOMEX — cómo aplicamos inteligencia artificial de vanguardia para resolver desafíos empresariales reales.",
    de: "Erfahren Sie mehr über diese KI-Fähigkeit von AUTOMEX — wie wir modernste künstliche Intelligenz zur Lösung realer Geschäftsprobleme einsetzen.",
    fr: "Découvrez cette capacité IA d'AUTOMEX — comment nous appliquons l'intelligence artificielle de pointe pour résoudre des défis commerciaux réels.",
    zh: "了解AUTOMEX的这项AI能力——我们如何应用尖端人工智能解决现实世界的商业挑战。",
    ar: "تعرف على قدرة الذكاء الاصطناعي هذه من AUTOMEX — كيف نطبق الذكاء الاصطناعي المتطور لحل تحديات الأعمال الحقيقية.",
  },
  caseStudies: {
    en: "Explore AUTOMEX case studies showcasing AI solutions, custom software, and digital transformation across industries. Real projects, real results.",
    es: "Explore los casos de estudio de AUTOMEX que muestran soluciones de IA, software personalizado y transformación digital en todas las industrias. Proyectos reales, resultados reales.",
    de: "Entdecken Sie AUTOMEX-Fallstudien, die KI-Lösungen, maßgeschneiderte Software und digitale Transformation in verschiedenen Branchen präsentieren. Echte Projekte, echte Ergebnisse.",
    fr: "Explorez les études de cas AUTOMEX présentant des solutions IA, des logiciels personnalisés et la transformation digitale dans tous les secteurs. De vrais projets, de vrais résultats.",
    zh: "探索AUTOMEX案例研究，展示跨行业的AI解决方案、定制软件和数字化转型。真实项目，真实成果。",
    ar: "استكشف دراسات الحالة من AUTOMEX التي تعرض حلول الذكاء الاصطناعي والبرمجيات المخصصة والتحول الرقمي عبر الصناعات. مشاريع حقيقية، نتائج حقيقية.",
  },
  caseStudyDetail: {
    en: "Read this AUTOMEX case study for an in-depth look at how we delivered AI and software solutions — challenge, solution, results, and technology stack.",
    es: "Lea este caso de estudio de AUTOMEX para un análisis en profundidad de cómo entregamos soluciones de IA y software — desafío, solución, resultados y stack tecnológico.",
    de: "Lesen Sie diese AUTOMEX-Fallstudie für einen detaillierten Einblick, wie wir KI- und Softwarelösungen geliefert haben — Herausforderung, Lösung, Ergebnisse und Technologie-Stack.",
    fr: "Lisez cette étude de cas AUTOMEX pour un aperçu approfondi de la façon dont nous avons livré des solutions IA et logicielles — défi, solution, résultats et stack technologique.",
    zh: "阅读这篇AUTOMEX案例研究，深入了解我们如何交付AI和软件解决方案——挑战、解决方案、成果和技术栈。",
    ar: "اقرأ دراسة الحالة هذه من AUTOMEX للحصول على نظرة متعمقة حول كيفية تقديمنا لحلول الذكاء الاصطناعي والبرمجيات — التحدي والحل والنتائج والمكدس التقني.",
  },
  portfolio: {
    en: "Browse AUTOMEX portfolio of custom software, AI solutions, and digital transformation projects across industries. See our work for startups, enterprises, and global brands.",
    es: "Explore el portafolio de AUTOMEX de software personalizado, soluciones de IA y proyectos de transformación digital en todas las industrias. Vea nuestro trabajo para startups, empresas y marcas globales.",
    de: "Durchstöbern Sie das AUTOMEX-Portfolio mit maßgeschneiderter Software, KI-Lösungen und Projekten zur digitalen Transformation in verschiedenen Branchen. Sehen Sie unsere Arbeit für Startups, Unternehmen und globale Marken.",
    fr: "Parcourez le portfolio AUTOMEX de logiciels personnalisés, de solutions IA et de projets de transformation digitale dans tous les secteurs. Découvrez notre travail pour les startups, les entreprises et les marques mondiales.",
    zh: "浏览AUTOMEX跨行业的定制软件、AI解决方案和数字化转型项目作品集。查看我们为初创企业、大型企业和全球品牌所做的工作。",
    ar: "تصفح محفظة AUTOMEX من البرمجيات المخصصة وحلول الذكاء الاصطناعي ومشاريع التحول الرقمي عبر الصناعات. شاهد عملنا للشركات الناشئة والمؤسسات والعلامات التجارية العالمية.",
  },
  portfolioDetail: {
    en: "Explore this AUTOMEX portfolio project — technology stack, client results, gallery images, and services delivered for successful digital transformation.",
    es: "Explore este proyecto del portafolio de AUTOMEX — stack tecnológico, resultados del cliente, imágenes de la galería y servicios entregados para una transformación digital exitosa.",
    de: "Entdecken Sie dieses AUTOMEX-Portfolio-Projekt — Technologie-Stack, Kundenergebnisse, Galeriebilder und gelieferte Dienstleistungen für eine erfolgreiche digitale Transformation.",
    fr: "Explorez ce projet du portfolio AUTOMEX — stack technologique, résultats clients, images de la galerie et services fournis pour une transformation digitale réussie.",
    zh: "探索这个AUTOMEX作品集项目——技术栈、客户成果、图库图片以及为成功数字化转型提供的服务。",
    ar: "استكشف مشروع محفظة AUTOMEX هذا — مجموعة التقنيات ونتائج العملاء وصور المعرض والخدمات المقدمة لتحول رقمي ناجح.",
  },
  blog: {
    en: "Read the latest articles, tutorials, and insights on AI, software development, cloud computing, and digital transformation from the AUTOMEX engineering team.",
    es: "Lea los últimos artículos, tutoriales y perspectivas sobre IA, desarrollo de software, computación en la nube y transformación digital del equipo de ingeniería de AUTOMEX.",
    de: "Lesen Sie die neuesten Artikel, Tutorials und Einblicke zu KI, Softwareentwicklung, Cloud Computing und digitaler Transformation vom AUTOMEX-Entwicklerteam.",
    fr: "Lisez les derniers articles, tutoriels et perspectives sur l'IA, le développement logiciel, le cloud computing et la transformation digitale de l'équipe d'ingénierie AUTOMEX.",
    zh: "阅读AUTOMEX工程团队关于AI、软件开发、云计算和数字化转型的最新文章、教程和见解。",
    ar: "اقرأ أحدث المقالات والدروس والرؤى حول الذكاء الاصطناعي وتطوير البرمجيات والحوسبة السحابية والتحول الرقمي من فريق هندسة AUTOMEX.",
  },
  blogDetail: {
    en: "Read this AUTOMEX blog article for expert insights on technology, software development, and AI solutions.",
    es: "Lea este artículo del blog de AUTOMEX para obtener información experta sobre tecnología, desarrollo de software y soluciones de IA.",
    de: "Lesen Sie diesen AUTOMEX-Blogartikel für Experteneinblicke zu Technologie, Softwareentwicklung und KI-Lösungen.",
    fr: "Lisez cet article du blog AUTOMEX pour des perspectives d'experts sur la technologie, le développement logiciel et les solutions IA.",
    zh: "阅读这篇AUTOMEX博客文章，获取关于技术、软件开发和AI解决方案的专家见解。",
    ar: "اقرأ مقالة مدونة AUTOMEX هذه للحصول على رؤى خبراء حول التكنولوجيا وتطوير البرمجيات وحلول الذكاء الاصطناعي.",
  },
  privacy: {
    en: "Learn how AUTOMEX collects, uses, and protects your personal information. Effective July 2025.",
    es: "Conozca cómo AUTOMEX recopila, utiliza y protege su información personal. Vigente desde julio de 2025.",
    de: "Erfahren Sie, wie AUTOMEX Ihre persönlichen Daten erhebt, verwendet und schützt. Gültig ab Juli 2025.",
    fr: "Découvrez comment AUTOMEX collecte, utilise et protège vos informations personnelles. En vigueur depuis juillet 2025.",
    zh: "了解AUTOMEX如何收集、使用和保护您的个人信息。自2025年7月起生效。",
    ar: "تعرف على كيفية جمع AUTOMEX واستخدامها وحماية معلوماتك الشخصية. ساري اعتبارًا من يوليو 2025.",
  },
  terms: {
    en: "Read the Terms of Service for AUTOMEX. Understand your rights and obligations when using our AI and software services.",
    es: "Lea los Términos de Servicio de AUTOMEX. Comprenda sus derechos y obligaciones al usar nuestros servicios de IA y software.",
    de: "Lesen Sie die Nutzungsbedingungen von AUTOMEX. Verstehen Sie Ihre Rechte und Pflichten bei der Nutzung unserer KI- und Software-Dienste.",
    fr: "Lisez les Conditions d'Utilisation d'AUTOMEX. Comprenez vos droits et obligations lors de l'utilisation de nos services IA et logiciels.",
    zh: "阅读AUTOMEX的服务条款。了解您在使用我们的AI和软件服务时的权利和义务。",
    ar: "اقرأ شروط الخدمة الخاصة بـ AUTOMEX. افهم حقوقك والتزاماتك عند استخدام خدمات الذكاء الاصطناعي والبرمجيات لدينا.",
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
    canonicalUrl,
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

  const metadata: Metadata = {
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

  if (canonicalUrl) {
    metadata.alternates = {
      ...metadata.alternates,
      canonical: canonicalUrl,
    };
  }

  return metadata;
}

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
  crm: {
    en: "CRM Overview – AUTOMEX Customer Management",
    es: "CRM – AUTOMEX Gestión de Clientes",
    de: "CRM-Übersicht – AUTOMEX Kundenmanagement",
    fr: "Aperçu CRM – AUTOMEX Gestion de la Clientèle",
    it: "Panoramica CRM – AUTOMEX Gestione Clienti",
    nl: "CRM Overzicht – AUTOMEX Klantbeheer",
    zh: "CRM总览 – AUTOMEX 客户管理",
    ar: "نظرة عامة على CRM – AUTOMEX إدارة العملاء",
    fa: "نمای کلی CRM – AUTOMEX مدیریت مشتریان",
    ps: "د CRM عمومي کتنه – AUTOMEX د پیرودونکو مدیریت",
  },
  bookCall: {
    en: "Book a Call – AUTOMEX Free Consultation",
    es: "Reservar una Llamada – AUTOMEX Consulta Gratuita",
    de: "Gespräch buchen – AUTOMEX Kostenlose Beratung",
    fr: "Réserver un Appel – AUTOMEX Consultation Gratuite",
    it: "Prenota una Chiamata – AUTOMEX Consulenza Gratuita",
    nl: "Belafspraak Boeken – AUTOMEX Gratis Consult",
    zh: "预约通话 – AUTOMEX 免费咨询",
    ar: "احجز مكالمة – AUTOMEX استشارة مجانية",
    fa: "رزرو تماس – AUTOMEX مشاوره رایگان",
    ps: "زنګ بک کړئ – AUTOMEX وړیا مشوره",
  },
  contactSales: {
    en: "Contact Sales – AUTOMEX Enterprise Sales",
    es: "Contactar Ventas – AUTOMEX Ventas Empresariales",
    de: "Vertrieb kontaktieren – AUTOMEX Enterprise Sales",
    fr: "Contacter les Ventes – AUTOMEX Ventes Entreprise",
    it: "Contatta le Vendite – AUTOMEX Vendite Aziendali",
    nl: "Contact Verkoop – AUTOMEX Enterprise Sales",
    zh: "联系销售 – AUTOMEX 企业销售",
    ar: "اتصل بالمبيعات – AUTOMEX مبيعات الشركات",
    fa: "تماس با فروش – AUTOMEX فروش سازمانی",
    ps: "د پلور سره اړیکه – AUTOMEX تصدۍ پلور",
  },
  quote: {
    en: "Request a Quote – AUTOMEX AI & Development",
    es: "Solicitar Presupuesto – AUTOMEX IA y Desarrollo",
    de: "Angebot anfordern – AUTOMEX KI & Entwicklung",
    fr: "Demander un Devis – AUTOMEX IA & Développement",
    it: "Richiedi un Preventivo – AUTOMEX IA & Sviluppo",
    nl: "Offerte Aanvragen – AUTOMEX AI & Ontwikkeling",
    zh: "请求报价 – AUTOMEX AI与开发",
    ar: "طلب عرض سعر – AUTOMEX الذكاء الاصطناعي والتطوير",
    fa: "درخواست پیش‌فاکتور – AUTOMEX هوش مصنوعی و توسعه",
    ps: "د نرخ غوښتنه – AUTOMEX AI او پراختیا",
  },
  services: {
    en: "Services – AUTOMEX AI, Software & Digital Transformation",
    es: "Servicios – AUTOMEX IA, Software y Transformación Digital",
    de: "Dienstleistungen – AUTOMEX KI, Software & Digitale Transformation",
    fr: "Services – AUTOMEX IA, Logiciel & Transformation Digitale",
    it: "Servizi – AUTOMEX IA, Software & Trasformazione Digitale",
    nl: "Diensten – AUTOMEX AI, Software & Digitale Transformatie",
    zh: "服务 – AUTOMEX AI、软件与数字化转型",
    ar: "الخدمات – AUTOMEX الذكاء الاصطناعي والبرمجيات والتحول الرقمي",
    fa: "خدمات – AUTOMEX هوش مصنوعی، نرم‌افزار و تحول دیجیتال",
    ps: "خدمات – AUTOMEX AI، سافټویر او ډیجیټل بدلون",
  },
  serviceDetail: {
    en: "AUTOMEX – AI & Software Development Service",
    es: "AUTOMEX – Servicio de Desarrollo de IA y Software",
    de: "AUTOMEX – KI- und Softwareentwicklungsdienst",
    fr: "AUTOMEX – Service de Développement IA et Logiciel",
    it: "AUTOMEX – Servizio di Sviluppo IA e Software",
    nl: "AUTOMEX – AI- en Softwareontwikkelingsdienst",
    zh: "AUTOMEX – AI与软件开发服务",
    ar: "AUTOMEX – خدمة تطوير الذكاء الاصطناعي والبرمجيات",
    fa: "AUTOMEX – سرویس توسعه هوش مصنوعی و نرم‌افزار",
    ps: "AUTOMEX – د AI او سافټویر پراختیا خدمت",
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
  crm: {
    en: "Manage leads, automate follow‑ups, and track customer interactions with AUTOMEX CRM. Streamline your sales process and grow your business.",
    es: "Gestione clientes potenciales, automatice seguimientos y realice un seguimiento de las interacciones con los clientes con el CRM de AUTOMEX. Optimice su proceso de ventas y haga crecer su negocio.",
    de: "Verwalten Sie Leads, automatisieren Sie Follow‑ups und verfolgen Sie Kundeninteraktionen mit AUTOMEX CRM. Optimieren Sie Ihren Verkaufsprozess und wachsen Sie Ihr Geschäft.",
    fr: "Gérez vos prospects, automatisez les relances et suivez les interactions clients avec le CRM AUTOMEX. Rationalisez votre processus de vente et développez votre entreprise.",
    it: "Gestisci lead, automatizza i follow‑up e traccia le interazioni con i clienti con il CRM AUTOMEX. Semplifica il processo di vendita e fai crescere il tuo business.",
    nl: "Beheer leads, automatiseer follow‑ups en volg klantinteracties met AUTOMEX CRM. Stroomlijn uw verkoopproces en laat uw bedrijf groeien.",
    zh: "使用AUTOMEX CRM管理潜在客户、自动跟进并跟踪客户互动。优化销售流程，助您业务增长。",
    ar: "إدارة العملاء المحتملين، وأتمتة المتابعات، وتتبع تفاعلات العملاء مع AUTOMEX CRM. تبسيط عملية البيع وتنمية أعمالك.",
    fa: "سرنخ‌ها را مدیریت کنید، پیگیری‌ها را خودکار کنید و تعاملات مشتری را با AUTOMEX CRM ردیابی کنید. فرآیند فروش را ساده کنید و کسب‌وکار خود را رشد دهید.",
    ps: "د مشرانو مدیریت، تعقیبونه اتومات کړئ، او د AUTOMEX CRM سره د پیرودونکو تعاملات تعقیب کړئ. خپل د پلور پروسه ساده کړئ او خپل سوداګري پراخه کړئ.",
  },
  bookCall: {
    en: "Schedule a free consultation with our AI experts. Discuss your project, explore possibilities, and get a personalised roadmap from AUTOMEX.",
    es: "Programe una consulta gratuita con nuestros expertos en IA. Discuta su proyecto, explore posibilidades y obtenga una hoja de ruta personalizada de AUTOMEX.",
    de: "Vereinbaren Sie ein kostenloses Beratungsgespräch mit unseren KI-Experten. Besprechen Sie Ihr Projekt, entdecken Sie Möglichkeiten und erhalten Sie eine persönliche Roadmap von AUTOMEX.",
    fr: "Planifiez une consultation gratuite avec nos experts en IA. Discutez de votre projet, explorez les possibilités et obtenez une feuille de route personnalisée d’AUTOMEX.",
    it: "Prenota una consulenza gratuita con i nostri esperti di IA. Discuti il tuo progetto, esplora le possibilità e ottieni una roadmap personalizzata da AUTOMEX.",
    nl: "Plan een gratis consult met onze AI-experts. Bespreek uw project, verken mogelijkheden en ontvang een persoonlijke roadmap van AUTOMEX.",
    zh: "与我们的AI专家预约免费咨询。讨论您的项目，探索可能性，并获得AUTOMEX的个性化路线图。",
    ar: "حدد موعدًا لاستشارة مجانية مع خبراء الذكاء الاصطناعي لدينا. ناقش مشروعك، واستكشف الاحتمالات، واحصل على خارطة طريق مخصصة من AUTOMEX.",
    fa: "یک جلسه مشاوره رایگان با کارشناسان هوش مصنوعی ما رزرو کنید. درباره پروژه خود گفتگو کنید، احتمالات را بررسی کنید و یک نقشه راه شخصی‌سازی شده از AUTOMEX دریافت کنید.",
    ps: "زموږ د AI کارپوهانو سره وړیا مشوره وټاکئ. خپله پروژه وغږیږئ، امکانات وپلټئ، او د AUTOMEX څخه شخصي نقشه ترلاسه کړئ.",
  },
  contactSales: {
    en: "Get in touch with our sales team for enterprise‑grade AI solutions, custom software, and digital transformation services. We'll help you find the right package.",
    es: "Póngase en contacto con nuestro equipo de ventas para soluciones de IA de nivel empresarial, software personalizado y servicios de transformación digital. Le ayudaremos a encontrar el paquete adecuado.",
    de: "Kontaktieren Sie unser Vertriebsteam für KI-Lösungen auf Unternehmensniveau, maßgeschneiderte Software und digitale Transformationsdienste. Wir helfen Ihnen, das passende Paket zu finden.",
    fr: "Contactez notre équipe commerciale pour des solutions IA de niveau entreprise, des logiciels sur mesure et des services de transformation digitale. Nous vous aiderons à trouver le bon package.",
    it: "Mettiti in contatto con il nostro team di vendita per soluzioni IA di livello enterprise, software personalizzato e servizi di trasformazione digitale. Ti aiuteremo a trovare il pacchetto giusto.",
    nl: "Neem contact op met ons salesteam voor enterprise-grade AI-oplossingen, maatwerksoftware en digitale transformatiediensten. Wij helpen u het juiste pakket te vinden.",
    zh: "联系我们的销售团队，获取企业级AI解决方案、定制软件和数字化转型服务。我们将帮助您找到合适的方案。",
    ar: "تواصل مع فريق المبيعات لدينا للحصول على حلول ذكاء اصطناعي على مستوى المؤسسات، وبرمجيات مخصصة، وخدمات التحول الرقمي. سنساعدك في العثور على الباقة المناسبة.",
    fa: "برای راهکارهای هوش مصنوعی سازمانی، نرم‌افزار سفارشی و خدمات تحول دیجیتال با تیم فروش ما تماس بگیرید. ما به شما کمک می‌کنیم بسته مناسب را پیدا کنید.",
    ps: "د تصدۍ کچې AI حل لارو، دودیز سافټویر، او ډیجیټل بدلون خدمتونو لپاره زموږ د پلور ټیم سره اړیکه ونیسئ. موږ به تاسو سره د مناسب بسته موندلو کې مرسته وکړو.",
  },
  quote: {
    en: "Tell us about your project and receive a detailed, no‑obligation quote from AUTOMEX. We'll analyse your requirements and provide a transparent cost breakdown.",
    es: "Cuéntenos sobre su proyecto y reciba un presupuesto detallado y sin compromiso de AUTOMEX. Analizaremos sus requisitos y le proporcionaremos un desglose de costes transparente.",
    de: "Erzählen Sie uns von Ihrem Projekt und erhalten Sie ein detailliertes, unverbindliches Angebot von AUTOMEX. Wir analysieren Ihre Anforderungen und erstellen eine transparente Kostenaufstellung.",
    fr: "Parlez-nous de votre projet et recevez un devis détaillé et sans engagement d'AUTOMEX. Nous analyserons vos besoins et vous fournirons une répartition transparente des coûts.",
    it: "Raccontaci del tuo progetto e ricevi un preventivo dettagliato e senza impegno da AUTOMEX. Analizzeremo i tuoi requisiti e ti forniremo una ripartizione dei costi trasparente.",
    nl: "Vertel ons over uw project en ontvang een gedetailleerde, vrijblijvende offerte van AUTOMEX. Wij analyseren uw wensen en geven een transparante kostenspecificatie.",
    zh: "告诉我们您的项目，即可获得AUTOMEX提供的详细、无义务报价。我们将分析您的需求并提供透明的费用明细。",
    ar: "أخبرنا عن مشروعك واحصل على عرض سعر مفصل وغير ملزم من AUTOMEX. سنقوم بتحليل متطلباتك وتزويدك بتفصيل شفاف للتكاليف.",
    fa: "درباره پروژه خود به ما بگویید و یک پیش‌فاکتور دقیق و بدون تعهد از AUTOMEX دریافت کنید. ما نیازهای شما را تحلیل کرده و یک تفکیک هزینه شفاف ارائه می‌دهیم.",
    ps: "موږ ته د خپلې پروژې په اړه ووایاست او د AUTOMEX څخه مفصل، پرته له ژمنې نرخ ترلاسه کړئ. موږ به ستاسو اړتیاوې تحلیل کړو او یو روښانه لګښت تحلیل به درکړو.",
  },
  services: {
    en: "Explore AUTOMEX services — AI-powered software development, web & mobile apps, cloud solutions, and digital transformation consulting.",
    es: "Explore los servicios de AUTOMEX — desarrollo de software impulsado por IA, aplicaciones web y móviles, soluciones en la nube y consultoría de transformación digital.",
    de: "Entdecken Sie AUTOMEX-Dienste — KI-gestützte Softwareentwicklung, Web- und Mobile-Apps, Cloud-Lösungen und Beratung zur digitalen Transformation.",
    fr: "Découvrez les services AUTOMEX — développement logiciel alimenté par l'IA, applications web et mobiles, solutions cloud et conseil en transformation digitale.",
    it: "Esplora i servizi AUTOMEX — sviluppo software basato su IA, app web e mobili, soluzioni cloud e consulenza per la trasformazione digitale.",
    nl: "Ontdek AUTOMEX-diensten — AI-aangedreven softwareontwikkeling, web- en mobiele apps, cloudoplossingen en digitale transformatieadvies.",
    zh: "探索AUTOMEX服务——AI驱动的软件开发、网页与移动应用、云解决方案和数字化转型咨询。",
    ar: "استكشف خدمات AUTOMEX — تطوير البرمجيات المدعوم بالذكاء الاصطناعي، وتطبيقات الويب والجوال، والحلول السحابية، واستشارات التحول الرقمي.",
    fa: "خدمات AUTOMEX را کاوش کنید — توسعه نرم‌افزار مبتنی بر هوش مصنوعی، اپلیکیشن‌های وب و موبایل، راهکارهای ابری و مشاوره تحول دیجیتال.",
    ps: "د AUTOMEX خدمتونه وپلټئ — د AI ځواکمن سافټویر پراختیا، ویب او موبایل اپلیکیشنونه، کلاوډ حل لارې او ډیجیټل بدلون مشوره.",
  },
  serviceDetail: {
    en: "Learn more about this AUTOMEX service — AI-driven development, expert delivery, and tailored technology solutions for your business.",
    es: "Obtenga más información sobre este servicio de AUTOMEX — desarrollo impulsado por IA, entrega experta y soluciones tecnológicas a medida para su negocio.",
    de: "Erfahren Sie mehr über diesen AUTOMEX-Dienst — KI-gesteuerte Entwicklung, fachkundige Lieferung und maßgeschneiderte Technologielösungen für Ihr Unternehmen.",
    fr: "En savoir plus sur ce service AUTOMEX — développement piloté par l'IA, livraison experte et solutions technologiques sur mesure pour votre entreprise.",
    it: "Scopri di più su questo servizio AUTOMEX — sviluppo guidato dall'IA, consegna esperta e soluzioni tecnologiche su misura per la tua azienda.",
    nl: "Lees meer over deze AUTOMEX-service — AI-gestuurde ontwikkeling, deskundige oplevering en op maat gemaakte technologieoplossingen voor uw bedrijf.",
    zh: "了解更多关于此AUTOMEX服务——AI驱动开发、专业交付以及为您的企业量身定制的技术解决方案。",
    ar: "تعرف على المزيد حول خدمة AUTOMEX هذه — تطوير مدعوم بالذكاء الاصطناعي، وتسليم خبير، وحلول تقنية مخصصة لعملك.",
    fa: "درباره این سرویس AUTOMEX بیشتر بدانید — توسعه مبتنی بر هوش مصنوعی، تحویل تخصصی و راهکارهای فناوری متناسب با کسب‌وکار شما.",
    ps: "د دې AUTOMEX خدمت په اړه نور معلومات ترلاسه کړئ — د AI لخوا پرمخ وړل شوې پراختیا، متخصص تحویل، او ستاسو سوداګرۍ لپاره مناسب ټکنالوژۍ حل لارې.",
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
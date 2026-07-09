// app/[locale]/(routes)/privacy/page.tsx
//
// Privacy Policy — Automex LLC
// Governing law: Washington State (RCW Title 19) + federal US law
// CCPA compliant (California residents), COPPA notice included
// Last updated: July 2025

import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import { SUPPORTED_LOCALES, isRtlLocale } from "@/lib/locale";

// ─── Metadata ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return generatePageMetadata({
    pageType: "contact", // Reuse contact style
    locale: locale as any,
    customTitle: isAr
      ? "سياسة الخصوصية — Automex"
      : "Privacy Policy — Automex",
    customDescription: isAr
      ? "تعرف على كيفية جمع Automex واستخدامها وحماية معلوماتك الشخصية. سارية اعتبارًا من يوليو 2025."
      : "Learn how Automex collects, uses, and protects your personal information. Effective July 2025.",
    pathSegment: "privacy",
  });
}

// ─── Constants ────────────────────────────────────────

const LAST_UPDATED = "July 9, 2025";
const COMPANY = "Automex LLC";
const SITE = "automex.tech";
const EMAIL = "privacy@automex.tech";
const ADDRESS = "4911 Talbot Rd S, Renton, WA 98055, United States";

// ─── Page ─────────────────────────────────────────────

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = isRtlLocale(locale);

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", url: `/${locale}` },
    { name: "Privacy Policy", url: `/${locale}/privacy` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <LocalBusinessSchema />

      <main
        className="min-h-screen bg-background text-foreground"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          {/* Header */}
          <div className="mb-12 border-b border-border/40 pb-8">
            <Link
              href={`/${locale}`}
              className="mb-6 inline-block text-sm font-medium text-primary hover:underline"
            >
              ← {isRtl ? "العودة إلى Automex" : "Back to Automex"}
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {isRtl ? "سياسة الخصوصية" : "Privacy Policy"}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              <strong>
                {isRtl ? "تاريخ السريان:" : "Effective date:"}
              </strong>{" "}
              {LAST_UPDATED} &nbsp;·&nbsp;{" "}
              <strong>{isRtl ? "الشركة:" : "Company:"}</strong> {COMPANY} &nbsp;·&nbsp;{" "}
              <strong>{isRtl ? "الموقع:" : "Location:"}</strong> {ADDRESS}
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {isRtl
                ? `توضح سياسة الخصوصية هذه كيفية قيام ${COMPANY} ("Automex" و"نحن" و"لنا" و"خاصتنا") بجمع واستخدام والإفصاح عن وحماية معلوماتك عند زيارتك لـ ${SITE}، أو استخدام منصتنا، أو الاستفادة من خدماتنا (يُشار إليها مجتمعة باسم "الخدمات"). يرجى قراءة هذه السياسة بعناية. إذا كنت لا توافق على هذه الشروط، يرجى التوقف عن استخدام الخدمات.`
                : `This Privacy Policy explains how ${COMPANY} ("Automex", "we", "us", or "our") collects, uses, discloses, and safeguards your information when you visit ${SITE}, use our platform, or engage our services (collectively, the "Services"). Please read this policy carefully. If you disagree with its terms, please discontinue use of the Services.`}
            </p>
          </div>

          {/* Prose body - unchanged from your original, just ensure placeholders use COMPANY, EMAIL, SITE, ADDRESS */}
          <div className="prose-legal">
            <Section id="1" title={isRtl ? "1. المعلومات التي نجمعها" : "1. Information We Collect"}>
              <p>
                {isRtl
                  ? "نجمع المعلومات التي تقدمها مباشرة، والمعلومات التي يتم جمعها تلقائيًا، والمعلومات من الأطراف الثالثة."
                  : "We collect information you provide directly, information collected automatically, and information from third parties."}
              </p>

              <SubHeading>
                {isRtl ? "1.1 المعلومات التي تقدمها مباشرة" : "1.1 Information You Provide Directly"}
              </SubHeading>
              <ul>
                <li>
                  <strong>
                    {isRtl ? "بيانات الحساب وجهات الاتصال" : "Account & contact data"}
                  </strong>{" "}
                  {isRtl
                    ? "— الاسم، البريد الإلكتروني، رقم الهاتف، اسم الشركة، المسمى الوظيفي، وكلمة المرور عند إنشاء حساب أو تقديم نموذج اتصال."
                    : "— name, email address, phone number, company name, job title, and password when you create an account or submit a contact form."}
                </li>
                <li>
                  <strong>
                    {isRtl ? "بيانات الفوترة والدفع" : "Billing & payment data"}
                  </strong>{" "}
                  {isRtl
                    ? "— عنوان الفوترة وتفاصيل طريقة الدفع (تتم معالجتها بواسطة معالجات الدفع المتوافقة مع PCI-DSS؛ لا نخزن أرقام البطاقات الكاملة)."
                    : "— billing address and payment method details (processed by our PCI-DSS-compliant payment processors; we do not store full card numbers)."}
                </li>
                <li>
                  <strong>{isRtl ? "الاتصالات" : "Communications"}</strong>{" "}
                  {isRtl
                    ? "— الرسائل، رسائل البريد الإلكتروني، تذاكر الدعم، وأي محتوى ترسله إلينا أو تحمله على منصتنا."
                    : "— messages, emails, support tickets, and any content you send to us or upload to our platform."}
                </li>
                <li>
                  <strong>
                    {isRtl ? "بيانات الاستبيانات والملاحظات" : "Survey and feedback data"}
                  </strong>{" "}
                  {isRtl
                    ? "— الردود على الاستبيانات، الشهادات، والملاحظات حول المنتج."
                    : "— responses to questionnaires, testimonials, and product feedback."}
                </li>
              </ul>

              <SubHeading>
                {isRtl ? "1.2 المعلومات التي يتم جمعها تلقائيًا" : "1.2 Information Collected Automatically"}
              </SubHeading>
              <ul>
                <li>
                  <strong>{isRtl ? "بيانات الاستخدام" : "Usage data"}</strong>{" "}
                  {isRtl
                    ? "— الصفحات التي تمت زيارتها، الميزات المستخدمة، النقرات، استعلامات البحث، الطوابع الزمنية، ومدة الجلسة."
                    : "— pages visited, features used, clicks, search queries, timestamps, and session duration."}
                </li>
                <li>
                  <strong>
                    {isRtl ? "بيانات الجهاز والسجلات" : "Device and log data"}
                  </strong>{" "}
                  {isRtl
                    ? "— عنوان IP، نوع المتصفح والإصدار، نظام التشغيل، عنوان الإحالة، وتقارير الأعطال."
                    : "— IP address, browser type and version, operating system, referral URL, and crash reports."}
                </li>
                <li>
                  <strong>
                    {isRtl ? "ملفات تعريف الارتباط وتقنيات التتبع" : "Cookies and tracking technologies"}
                  </strong>{" "}
                  {isRtl
                    ? "— نستخدم ملفات تعريف الارتباط من الطرف الأول والثالث، وإشارات الويب، والتقنيات المماثلة كما هو موضح في القسم 7 أدناه."
                    : "— we use first-party and third-party cookies, web beacons, and similar technologies as described in Section 7 below."}
                </li>
              </ul>

              <SubHeading>
                {isRtl ? "1.3 المعلومات من الأطراف الثالثة" : "1.3 Information from Third Parties"}
              </SubHeading>
              <ul>
                <li>
                  <strong>{isRtl ? "موفرو OAuth" : "OAuth providers"}</strong>{" "}
                  {isRtl
                    ? "— إذا قمت بتسجيل الدخول باستخدام Google أو أي موفر OAuth آخر، فإننا نتلقى اسمك وبريدك الإلكتروني وصورة ملفك الشخصي من ذلك الموفر."
                    : "— if you sign in with Google or another OAuth provider, we receive your name, email address, and profile picture from that provider."}
                </li>
                <li>
                  <strong>
                    {isRtl ? "شركاء التكامل" : "Integration partners"}
                  </strong>{" "}
                  {isRtl
                    ? "— عند توصيل خدمات الطرف الثالث (مثل HubSpot، Slack، Asana) بـ Automex، فإننا نتلقى البيانات اللازمة لتشغيل تلك التكاملات نيابة عنك."
                    : "— when you connect third-party services (e.g., HubSpot, Slack, Asana) to Automex, we receive the data necessary to operate those integrations on your behalf."}
                </li>
                <li>
                  <strong>
                    {isRtl ? "المصادر المتاحة للجمهور" : "Publicly available sources"}
                  </strong>{" "}
                  {isRtl
                    ? "— أدلة الأعمال، LinkedIn، والمصادر المماثلة لأغراض المبيعات والتسويق."
                    : "— business directories, LinkedIn, and similar sources for sales and marketing purposes."}
                </li>
              </ul>
            </Section>

            <Section id="2" title={isRtl ? "2. كيفية استخدام معلوماتك" : "2. How We Use Your Information"}>
              <p>
                {isRtl
                  ? "نستخدم معلوماتك للأغراض التالية:"
                  : "We use your information for the following purposes:"}
              </p>
              <ul>
                <li>
                  <strong>
                    {isRtl ? "تقديم وتشغيل الخدمات" : "Providing and operating the Services"}
                  </strong>{" "}
                  {isRtl
                    ? "— لإنشاء وإدارة حسابك، معالجة المعاملات، التحقق من هويتك، وتقديم الميزات التي تطلبها."
                    : "— to create and manage your account, process transactions, authenticate your identity, and deliver the features you request."}
                </li>
                <li>
                  <strong>
                    {isRtl ? "تحسين وتطوير الخدمات" : "Improving and developing the Services"}
                  </strong>{" "}
                  {isRtl
                    ? "— لتحليل أنماط الاستخدام، تشخيص المشكلات التقنية، إجراء الأبحاث، وبناء ميزات جديدة."
                    : "— to analyze usage patterns, diagnose technical problems, conduct research, and build new features."}
                </li>
                <li>
                  <strong>{isRtl ? "الاتصالات" : "Communications"}</strong>{" "}
                  {isRtl
                    ? "— لإرسال رسائل المعاملات (الإيصالات، تنبيهات الأمان، إشعارات الحساب) و، بموافقتك، رسائل تسويقية. يمكنك إلغاء الاشتراك في التسويق في أي وقت."
                    : "— to send transactional messages (receipts, security alerts, account notices) and, with your consent, marketing emails. You may opt out of marketing at any time."}
                </li>
                <li>
                  <strong>{isRtl ? "دعم العملاء" : "Customer support"}</strong>{" "}
                  {isRtl
                    ? "— للرد على الاستفسارات، حل النزاعات، واستكشاف المشكلات."
                    : "— to respond to inquiries, resolve disputes, and troubleshoot issues."}
                </li>
                <li>
                  <strong>
                    {isRtl ? "الامتثال القانوني والسلامة" : "Legal compliance and safety"}
                  </strong>{" "}
                  {isRtl
                    ? "— للامتثال للقوانين واللوائح المعمول بها، تطبيق شروطنا، وحماية حقوق وممتلكات وسلامة Automex ومستخدمينا والجمهور."
                    : "— to comply with applicable laws and regulations, enforce our terms, and protect the rights, property, and safety of Automex, our users, and the public."}
                </li>
                <li>
                  <strong>
                    {isRtl ? "منع الاحتيال والأمان" : "Fraud prevention and security"}
                  </strong>{" "}
                  {isRtl
                    ? "— لاكتشاف والتحقيق ومنع المعاملات الاحتيالية والإساءة وغيرها من الأنشطة غير القانونية."
                    : "— to detect, investigate, and prevent fraudulent transactions, abuse, and other illegal activity."}
                </li>
              </ul>
              <p>
                {isRtl
                  ? `نقوم بمعالجة بياناتك الشخصية بموجب الأسس القانونية التالية (حيثما ينطبق ذلك بموجب قانون الخصوصية الأمريكي والمعايير الدولية): أداء العقد (الوفاء باتفاقنا معك)، المصالح المشروعة (تحسين الخدمات وتأمينها)، الالتزام القانوني، والموافقة (للاتصالات التسويقية الاختيارية).`
                  : `We process your personal data under the following legal bases (where applicable under US privacy law and international standards): contract performance (fulfilling our agreement with you), legitimate interests (improving and securing the Services), legal obligation, and consent (for optional marketing communications).`}
              </p>
            </Section>

            <Section id="3" title={isRtl ? "3. كيفية مشاركة معلوماتك" : "3. How We Share Your Information"}>
              <p>
                {isRtl
                  ? "لا نقوم ببيع أو تأجير أو تبادل معلوماتك الشخصية. نشاركها فقط كما هو موضح أدناه."
                  : "We do not sell, rent, or trade your personal information. We share it only as described below."}
              </p>
              <ul>
                <li>
                  <strong>{isRtl ? "موفرو الخدمة" : "Service providers"}</strong>{" "}
                  {isRtl
                    ? "— البائعون من الأطراف الثالثة الذين يقومون بمعالجة البيانات نيابة عنا (استضافة السحابة، معالجة الدفع، تسليم البريد الإلكتروني، التحليلات، أدوات دعم العملاء). يلتزم هؤلاء البائعون بحماية بياناتك ولا يجوز لهم استخدامها لأغراضهم الخاصة."
                    : "— third-party vendors who process data on our behalf (cloud hosting, payment processing, email delivery, analytics, customer support tooling). These vendors are contractually bound to protect your data and may not use it for their own purposes."}
                </li>
                <li>
                  <strong>{isRtl ? "شركاء التكامل" : "Integration partners"}</strong>{" "}
                  {isRtl
                    ? "— عندما تقوم بتوصيل أداة تابعة لطرف ثالث بـ Automex بشكل صريح، فإننا نشارك البيانات اللازمة لتشغيل هذا التكامل. يخضع استخدامك لخدمات الطرف الثالث لسياسات الخصوصية الخاصة بهم."
                    : "— when you explicitly connect a third-party tool to Automex, we share the data necessary to operate that integration. Your use of third-party services is governed by their own privacy policies."}
                </li>
                <li>
                  <strong>{isRtl ? "التحويلات التجارية" : "Business transfers"}</strong>{" "}
                  {isRtl
                    ? "— فيما يتعلق بعملية اندماج أو استحواذ أو تمويل أو بيع كل أو جزء من أصولنا، قد يتم نقل بياناتك كجزء من تلك الصفقة. سنخطرك عبر البريد الإلكتروني أو إشعار بارز على موقعنا إذا حدث هذا النقل."
                    : "— in connection with a merger, acquisition, financing, or sale of all or a portion of our assets, your data may be transferred as part of that transaction. We will notify you via email or prominent notice on our site if such a transfer occurs."}
                </li>
                <li>
                  <strong>{isRtl ? "المتطلبات القانونية" : "Legal requirements"}</strong>{" "}
                  {isRtl
                    ? "— قد نكشف عن بياناتك إذا كان ذلك مطلوبًا بموجب القانون أو اللوائح أو الإجراءات القانونية أو الطلبات الحكومية، أو لتنفيذ اتفاقياتنا أو حماية حقوقنا."
                    : "— we may disclose your data if required by law, regulation, legal process, or governmental request, or to enforce our agreements or protect our rights."}
                </li>
                <li>
                  <strong>{isRtl ? "بموافقتك" : "With your consent"}</strong>{" "}
                  {isRtl
                    ? "— قد نشارك بياناتك لأي غرض آخر بموافقتك الصريحة."
                    : "— we may share your data for any other purpose with your explicit consent."}
                </li>
              </ul>
            </Section>

            <Section id="4" title={isRtl ? "4. الاحتفاظ بالبيانات" : "4. Data Retention"}>
              <p>
                {isRtl
                  ? `نحتفظ ببياناتك الشخصية طالما كان حسابك نشطًا أو طالما كانت ضرورية لتقديم الخدمات. على وجه التحديد:`
                  : `We retain your personal data for as long as your account is active or as needed to provide the Services. Specifically:`}
              </p>
              <ul>
                <li>
                  <strong>{isRtl ? "بيانات الحساب" : "Account data"}</strong>{" "}
                  {isRtl
                    ? `— يتم الاحتفاظ بها طوال عمر حسابك ولمدة تصل إلى 3 سنوات بعد الإغلاق لتسوية النزاعات، ومنع الاحتيال، والامتثال لالتزاماتنا القانونية.`
                    : `— is retained for the life of your account and up to 3 years after closure for dispute resolution, fraud prevention, and compliance with our legal obligations.`}
                </li>
                <li>
                  <strong>{isRtl ? "السجلات المالية والمعاملات" : "Financial and transactional records"}</strong>{" "}
                  {isRtl
                    ? `— يتم الاحتفاظ بها لمدة 7 سنوات كحد أدنى وفقًا للوائح الضريبية والمحاسبية الأمريكية.`
                    : `— are retained for a minimum of 7 years as required by US tax and accounting regulations.`}
                </li>
                <li>
                  <strong>{isRtl ? "بيانات التسويق" : "Marketing data"}</strong>{" "}
                  {isRtl
                    ? `— يتم الاحتفاظ بها حتى تقوم بإلغاء الاشتراك أو سحب الموافقة، وبعد ذلك نقوم بحظر جهة اتصالك من الحملات المستقبلية ولكن قد نحتفظ بسجل لعملية إلغاء الاشتراك.`
                    : `— is retained until you opt out or withdraw consent, after which we suppress your contact from future campaigns but may retain a record of the opt-out.`}
                </li>
                <li>
                  <strong>{isRtl ? "سجلات الخادم والأمان" : "Server and security logs"}</strong>{" "}
                  {isRtl
                    ? `— يتم الاحتفاظ بها لمدة تصل إلى 90 يومًا وتستخدم فقط للأمان وتصحيح الأخطاء.`
                    : `— are retained for up to 90 days and used solely for security and debugging.`}
                </li>
              </ul>
              <p>
                {isRtl
                  ? "عندما لا تكون البيانات مطلوبة، نقوم بحذفها أو إخفاء هويتها بشكل آمن."
                  : "When data is no longer needed, we securely delete or anonymize it."}
              </p>
            </Section>

            <Section id="5" title={isRtl ? "5. الأمان" : "5. Security"}>
              <p>
                {isRtl
                  ? "نحن نطبق تدابير تقنية وتنظيمية معقولة تجاريًا لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. تشمل هذه التدابير:"
                  : "We implement commercially reasonable technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:"}
              </p>
              <ul>
                <li>{isRtl ? "تشفير TLS 1.2+ أثناء النقل وتشفير AES-256 أثناء التخزين." : "TLS 1.2+ encryption in transit and AES-256 encryption at rest."}</li>
                <li>{isRtl ? "ضوابط الوصول القائمة على الأدوار التي تحد من وصول الموظفين إلى البيانات الشخصية." : "Role-based access controls limiting employee access to personal data."}</li>
                <li>{isRtl ? "تقييمات أمنية منتظمة واختبارات اختراق." : "Regular security assessments and penetration testing."}</li>
                <li>{isRtl ? "متطلبات المصادقة متعددة العوامل للأنظمة الداخلية التي تعالج البيانات الشخصية." : "Multi-factor authentication requirements for internal systems that process personal data."}</li>
              </ul>
              <p>
                {isRtl
                  ? "لا توجد طريقة نقل عبر الإنترنت أو تخزين إلكتروني آمنة بنسبة 100٪. لا يمكننا ضمان الأمان المطلق؛ ومع ذلك، نحن ملزمون بإخطار المستخدمين المتأثرين فورًا في حالة حدوث خرق للبيانات وفقًا للقانون المعمول به، بما في ذلك قانون إشعار خرق الأمن في ولاية واشنطن (RCW 19.255)."
                  : "No method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security; however, we are committed to promptly notifying affected users in the event of a data breach as required by applicable law, including Washington State's Security Breach Notification Act (RCW 19.255)."}
              </p>
            </Section>

            <Section id="6" title={isRtl ? "6. حقوقك وخياراتك" : "6. Your Rights and Choices"}>
              <p>
                {isRtl
                  ? "اعتمادًا على مكان إقامتك، قد تكون لك حقوق معينة فيما يتعلق بمعلوماتك الشخصية."
                  : "Depending on where you reside, you may have certain rights regarding your personal information."}
              </p>

              <SubHeading>
                {isRtl ? "6.1 سكان ولاية واشنطن" : "6.1 Washington State Residents"}
              </SubHeading>
              <p>
                {isRtl
                  ? "يوفر قانون My Health MY Data (MHMD) وقانون خصوصية واشنطن (WPA) للمقيمين حقوقًا في الوصول إلى بيانات شخصية معينة وتصحيحها وحذفها. تحترم Automex هذه الحقوق لجميع المستخدمين بغض النظر عن الولاية."
                  : "Washington's My Health MY Data Act (MHMD) and the Washington Privacy Act (WPA) provide residents with rights to access, correct, and delete certain personal data. Automex honors these rights for all users regardless of state."}
              </p>

              <SubHeading>
                {isRtl ? "6.2 سكان كاليفورنيا (CCPA / CPRA)" : "6.2 California Residents (CCPA / CPRA)"}
              </SubHeading>
              <p>
                {isRtl
                  ? `يحق لسكان كاليفورنيا: (أ) معرفة المعلومات الشخصية التي نجمعها وكيفية استخدامها ومشاركتها؛ (ب) حذف المعلومات الشخصية التي نحتفظ بها عنك؛ (ج) إلغاء الاشتراك في بيع أو مشاركة المعلومات الشخصية (لا نبيع المعلومات الشخصية)؛ (د) تصحيح المعلومات الشخصية غير الدقيقة؛ (هـ) تقييد استخدام المعلومات الشخصية الحساسة. لممارسة هذه الحقوق، اتصل بنا على ${EMAIL}. لن نميز ضدك لممارسة حقوقك.`
                  : `California residents have the right to: (a) know what personal information we collect and how we use and share it; (b) delete personal information we hold about you; (c) opt out of the sale or sharing of personal information (we do not sell personal information); (d) correct inaccurate personal information; and (e) limit use of sensitive personal information. To exercise these rights, contact us at ${EMAIL}. We will not discriminate against you for exercising your rights.`}
              </p>

              <SubHeading>
                {isRtl ? "6.3 جميع المستخدمين" : "6.3 All Users"}
              </SubHeading>
              <ul>
                <li>
                  <strong>{isRtl ? "الوصول وقابلية النقل" : "Access & portability"}</strong>{" "}
                  {isRtl
                    ? "— يمكنك طلب نسخة من البيانات الشخصية التي نحتفظ بها عنك بتنسيق منظم وقابل للقراءة آليًا."
                    : "— you may request a copy of the personal data we hold about you in a structured, machine-readable format."}
                </li>
                <li>
                  <strong>{isRtl ? "التصحيح" : "Correction"}</strong>{" "}
                  {isRtl
                    ? "— يمكنك تحديث أو تصحيح البيانات غير الدقيقة من خلال إعدادات حسابك أو عن طريق الاتصال بنا."
                    : "— you may update or correct inaccurate data through your account settings or by contacting us."}
                </li>
                <li>
                  <strong>{isRtl ? "الحذف" : "Deletion"}</strong>{" "}
                  {isRtl
                    ? "— يمكنك طلب حذف بياناتك الشخصية. سنلبي طلبك ما لم يكن الاحتفاظ مطلوبًا بموجب القانون أو لأغراض تجارية مشروعة (مثل منع الاحتيال)."
                    : "— you may request deletion of your personal data. We will fulfill your request unless retention is required by law or for legitimate business purposes (e.g., fraud prevention)."}
                </li>
                <li>
                  <strong>{isRtl ? "إلغاء الاشتراك في التسويق" : "Opt out of marketing"}</strong>{" "}
                  {isRtl
                    ? "— يمكنك إلغاء الاشتراك في رسائل البريد الإلكتروني التسويقية في أي وقت بالنقر على 'إلغاء الاشتراك' في أي بريد إلكتروني أو الاتصال بنا مباشرة."
                    : "— you may unsubscribe from marketing emails at any time by clicking 'Unsubscribe' in any email or contacting us directly."}
                </li>
                <li>
                  <strong>{isRtl ? "إغلاق الحساب" : "Account closure"}</strong>{" "}
                  {isRtl
                    ? "— يمكنك إغلاق حسابك في أي وقت من خلال صفحة إعدادات الحساب."
                    : "— you may close your account at any time through the account settings page."}
                </li>
              </ul>
              <p>
                {isRtl
                  ? `لتقديم طلب حقوق، أرسل بريدًا إلكترونيًا إلى ${EMAIL} مع موضوع "طلب حقوق الخصوصية". سنرد في غضون 45 يومًا (مع تمديد إضافي يصل إلى 45 يومًا عند الضرورة المعقولة).`
                  : `To submit a rights request, email ${EMAIL} with the subject line "Privacy Rights Request." We will respond within 45 days (with up to a 45-day extension where reasonably necessary).`}
              </p>
            </Section>

            <Section id="7" title={isRtl ? "7. ملفات تعريف الارتباط وتقنيات التتبع" : "7. Cookies and Tracking Technologies"}>
              <p>
                {isRtl
                  ? "نستخدم الأنواع التالية من ملفات تعريف الارتباط والتقنيات المماثلة:"
                  : "We use the following types of cookies and similar technologies:"}
              </p>
              <ul>
                <li>
                  <strong>{isRtl ? "ملفات تعريف الارتباط الضرورية للغاية" : "Strictly necessary cookies"}</strong>{" "}
                  {isRtl
                    ? "— مطلوبة لكي تعمل الخدمات (إدارة الجلسة، المصادقة، الأمان). لا يمكن تعطيلها."
                    : "— required for the Services to function (session management, authentication, security). These cannot be disabled."}
                </li>
                <li>
                  <strong>{isRtl ? "ملفات تعريف الارتباط الخاصة بالتحليلات" : "Analytics cookies"}</strong>{" "}
                  {isRtl
                    ? "— تساعدنا في فهم كيفية تفاعل المستخدمين مع الخدمات (مثل مشاهدات الصفحة، مدة الجلسة). نستخدم أدوات مثل Google Analytics مع تمكين إخفاء الهوية للعنوان IP."
                    : "— help us understand how users interact with the Services (e.g., page views, session duration). We use tools such as Google Analytics with IP anonymization enabled."}
                </li>
                <li>
                  <strong>{isRtl ? "ملفات تعريف الارتباط الخاصة بالتفضيلات" : "Preference cookies"}</strong>{" "}
                  {isRtl
                    ? "— تتذكر إعداداتك (مثل اللغة والسمة) حتى لا تضطر إلى ضبطها في كل زيارة."
                    : "— remember your settings (e.g., language, theme) so you do not have to set them on every visit."}
                </li>
                <li>
                  <strong>{isRtl ? "ملفات تعريف الارتباط التسويقية" : "Marketing cookies"}</strong>{" "}
                  {isRtl
                    ? "— تُستخدم بموافقتك لتقديم إعلانات ذات صلة. لا نستخدم شبكات إعلانات تابعة لجهات خارجية دون موافقتك الصريحة."
                    : "— used with your consent to deliver relevant advertisements. We do not use third-party ad networks without your explicit consent."}
                </li>
              </ul>
              <p>
                {isRtl
                  ? `يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك. قد يؤثر تعطيل ملفات تعريف ارتباط معينة على وظائف الخدمات. نحن نحترم إشارات "لا تتبع" (DNT) المستندة إلى المتصفح بقدر ما هو ممكن تقنيًا.`
                  : "You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of the Services. We honor browser-based 'Do Not Track' (DNT) signals to the extent technically feasible."}
              </p>
            </Section>

            <Section id="8" title={isRtl ? "8. روابط وخدمات الطرف الثالث" : "8. Third-Party Links and Services"}>
              <p>
                {isRtl
                  ? `قد تحتوي الخدمات على روابط لمواقع ويب تابعة لجهات خارجية أو عمليات تكامل أو خدمات لا تديرها Automex. لسنا مسؤولين عن الممارسات الخصوصية لأي طرف ثالث. نشجعك على مراجعة سياسة الخصوصية لكل موقع أو خدمة تزورها.`
                  : `The Services may contain links to third-party websites, integrations, or services that are not operated by Automex. We are not responsible for the privacy practices of any third party. We encourage you to review the privacy policy of every site or service you visit.`}
              </p>
            </Section>

            <Section id="9" title={isRtl ? "9. خصوصية الأطفال (COPPA)" : "9. Children's Privacy (COPPA)"}>
              <p>
                {isRtl
                  ? `الخدمات غير موجهة للأطفال دون سن 13. لا نجمع عن قصد معلومات شخصية من الأطفال دون سن 13. إذا كنت ولي أمر أو وصي وتعتقد أن طفلك قد زودنا بمعلومات شخصية، يرجى الاتصال بنا على ${EMAIL}. إذا اكتشفنا أننا جمعنا معلومات شخصية من طفل دون سن 13، سنقوم بحذفها فورًا وفقًا لقانون حماية خصوصية الأطفال عبر الإنترنت (COPPA).`
                  : `The Services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at ${EMAIL}. If we discover we have collected personal information from a child under 13, we will promptly delete it in accordance with the Children's Online Privacy Protection Act (COPPA).`}
              </p>
            </Section>

            <Section id="10" title={isRtl ? "10. المستخدمون الدوليون" : "10. International Users"}>
              <p>
                {isRtl
                  ? `يقع المقر الرئيسي لـ Automex في الولايات المتحدة. إذا قمت بالوصول إلى الخدمات من خارج الولايات المتحدة، فسيتم نقل معلوماتك وتخزينها ومعالجتها في الولايات المتحدة أو في البلدان الأخرى التي يعمل فيها موفرو الخدمة لدينا. باستخدام الخدمات، فإنك توافق على هذا النقل. نتخذ خطوات لضمان حماية بياناتك بمستوى كافٍ أينما تمت معالجتها.`
                  : `Automex is headquartered in the United States. If you access the Services from outside the United States, your information will be transferred to, stored, and processed in the United States or other countries where our service providers operate. By using the Services, you consent to this transfer. We take steps to ensure that your data receives an adequate level of protection wherever it is processed.`}
              </p>
            </Section>

            <Section id="11" title={isRtl ? "11. التغييرات على سياسة الخصوصية هذه" : "11. Changes to This Privacy Policy"}>
              <p>
                {isRtl
                  ? "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. عند إجراء تغييرات جوهرية، سنخطرك عن طريق:"
                  : "We may update this Privacy Policy from time to time. When we make material changes, we will notify you by:"}
              </p>
              <ul>
                <li>
                  {isRtl
                    ? "نشر السياسة المحدثة على هذه الصفحة مع تاريخ سريان منقح في الأعلى."
                    : "Posting the updated policy on this page with a revised 'Effective date' at the top."}
                </li>
                <li>
                  {isRtl
                    ? `إرسال إشعار عبر البريد الإلكتروني إلى العنوان المرتبط بحسابك قبل 30 يومًا على الأقل من سريان التغييرات.`
                    : `Sending an email notice to the address associated with your account at least 30 days before the changes take effect.`}
                </li>
              </ul>
              <p>
                {isRtl
                  ? "استمرارك في استخدام الخدمات بعد تاريخ السريان يشكل قبولك للسياسة المنقحة. إذا كنت لا توافق على التغييرات، فيجب عليك التوقف عن استخدام الخدمات ويمكنك طلب حذف الحساب."
                  : "Your continued use of the Services after the effective date constitutes your acceptance of the revised policy. If you do not agree to the changes, you must stop using the Services and may request account deletion."}
              </p>
            </Section>

            <Section id="12" title={isRtl ? "12. اتصل بنا" : "12. Contact Us"}>
              <p>
                {isRtl
                  ? "إذا كان لديك أي أسئلة أو مخاوف أو طلبات بخصوص سياسة الخصوصية هذه أو ممارسات البيانات الخاصة بنا، يرجى الاتصال بنا:"
                  : "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:"}
              </p>
              <address className="not-italic mt-4 rounded-xl border border-border/50 bg-muted/30 p-5 text-sm leading-7 text-foreground">
                <strong>{COMPANY}</strong>
                <br />
                {isRtl ? "الخصوصية والامتثال للبيانات" : "Privacy & Data Compliance"}
                <br />
                {ADDRESS}
                <br />
                {isRtl ? "البريد الإلكتروني:" : "Email:"}{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {EMAIL}
                </a>
                <br />
                {isRtl ? "الموقع:" : "Website:"}{" "}
                <a
                  href={`https://${SITE}`}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE}
                </a>
              </address>
              <p className="mt-4">
                {isRtl
                  ? "نحن ملتزمون بحل الشكاوى المتعلقة بخصوصيتك وجمعنا أو استخدامنا لمعلوماتك الشخصية. إذا كان لديك شكوى لم يتم حلها تتعلق بالخصوصية أو استخدام البيانات ولم نعالجها بشكل مرض، يرجى الاتصال بنا على البريد الإلكتروني أعلاه."
                  : "We are committed to resolving complaints about your privacy and our collection or use of your personal information. If you have an unresolved privacy or data use concern that we have not addressed satisfactorily, please contact us at the email above."}
              </p>
            </Section>

            {/* Footer note */}
            <div className="mt-12 rounded-xl border border-border/40 bg-muted/20 p-5 text-xs leading-6 text-muted-foreground">
              <strong>{isRtl ? "إشعار قانوني:" : "Legal notice:"}</strong>{" "}
              {isRtl
                ? `سياسة الخصوصية هذه مقدمة لأغراض إعلامية وتشكل اتفاقية ملزمة بينك وبين ${COMPANY}. تخضع لقوانين ولاية واشنطن، الولايات المتحدة، دون اعتبار لتعارض أحكام القوانين. يتم حل أي نزاعات تنشأ بموجب هذه السياسة حصريًا في المحاكم الحكومية أو الفيدرالية في مقاطعة كينغ، واشنطن.`
                : `This Privacy Policy is provided for informational purposes and constitutes a binding agreement between you and ${COMPANY}. It is governed by the laws of the State of Washington, United States, without regard to its conflict-of-law provisions. Any disputes arising under this policy shall be resolved exclusively in the state or federal courts located in King County, Washington.`}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="mt-12 flex flex-wrap gap-4 border-t border-border/40 pt-8 text-sm text-muted-foreground">
            <Link href={`/${locale}/terms`} className="hover:text-foreground hover:underline">
              {isRtl ? "شروط الخدمة" : "Terms of Service"}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-foreground hover:underline">
              {isRtl ? "اتصل بنا" : "Contact Us"}
            </Link>
            <Link href={`/${locale}`} className="hover:text-foreground hover:underline">
              {isRtl ? "العودة إلى الرئيسية" : "Back to Home"}
            </Link>
          </div>
        </div>

        {/* Inline prose styles */}
        <style>{`
          .prose-legal {
            font-size: 0.9375rem;
            line-height: 1.75;
            color: inherit;
          }
          .prose-legal p {
            margin-top: 0;
            margin-bottom: 1rem;
          }
          .prose-legal ul {
            margin: 0.75rem 0 1rem 0;
            padding-left: 1.5rem;
            list-style-type: disc;
          }
          .prose-legal ul li {
            margin-bottom: 0.5rem;
          }
          .prose-legal a {
            color: var(--primary);
            text-decoration: none;
          }
          .prose-legal a:hover {
            text-decoration: underline;
          }
          .prose-legal strong {
            font-weight: 600;
            color: var(--foreground);
          }
        `}</style>
      </main>
    </>
  );
}

// ─── Helpers ────────────────────────────────────────

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`section-${id}`} className="mb-10">
      <h2
        id={`section-${id}`}
        className="mb-4 text-xl font-bold tracking-tight text-foreground"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
      {children}
    </h3>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}
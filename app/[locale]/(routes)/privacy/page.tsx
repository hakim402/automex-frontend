// app/[locale]/privacy/page.tsx
//
// Privacy Policy — Automex LLC
// Governing law: Washington State (RCW Title 19) + federal US law
// CCPA compliant (California residents), COPPA notice included
// Last updated: June 2025

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Automex",
  description:
    "Learn how Automex collects, uses, and protects your personal information. Effective June 2025.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "June 28, 2025";
const COMPANY      = "Automex LLC";
const SITE         = "automex.tech";
const EMAIL        = "privacy@automex.tech";
const ADDRESS      = "Seattle, WA, United States";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── Page shell ── */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">

        {/* Header */}
        <div className="mb-12 border-b border-border/40 pb-8">
          <Link
            href="/"
            className="mb-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            ← Back to Automex
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            <strong>Effective date:</strong> {LAST_UPDATED} &nbsp;·&nbsp;{" "}
            <strong>Company:</strong> {COMPANY} &nbsp;·&nbsp;{" "}
            <strong>Location:</strong> {ADDRESS}
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            This Privacy Policy explains how {COMPANY} ("<strong>Automex</strong>",
            "<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>")
            collects, uses, discloses, and safeguards your information when you visit{" "}
            <strong>{SITE}</strong>, use our platform, or engage our services
            (collectively, the "<strong>Services</strong>"). Please read this policy
            carefully. If you disagree with its terms, please discontinue use of the
            Services.
          </p>
        </div>

        {/* Prose body */}
        <div className="prose-legal">

          <Section id="1" title="1. Information We Collect">
            <p>
              We collect information you provide directly, information collected
              automatically, and information from third parties.
            </p>

            <SubHeading>1.1 Information You Provide Directly</SubHeading>
            <ul>
              <li>
                <strong>Account &amp; contact data</strong> — name, email address,
                phone number, company name, job title, and password when you create
                an account or submit a contact form.
              </li>
              <li>
                <strong>Billing &amp; payment data</strong> — billing address and
                payment method details (processed by our PCI-DSS-compliant payment
                processors; we do not store full card numbers).
              </li>
              <li>
                <strong>Communications</strong> — messages, emails, support tickets,
                and any content you send to us or upload to our platform.
              </li>
              <li>
                <strong>Survey and feedback data</strong> — responses to questionnaires,
                testimonials, and product feedback.
              </li>
            </ul>

            <SubHeading>1.2 Information Collected Automatically</SubHeading>
            <ul>
              <li>
                <strong>Usage data</strong> — pages visited, features used, clicks,
                search queries, timestamps, and session duration.
              </li>
              <li>
                <strong>Device and log data</strong> — IP address, browser type and
                version, operating system, referral URL, and crash reports.
              </li>
              <li>
                <strong>Cookies and tracking technologies</strong> — we use first-party
                and third-party cookies, web beacons, and similar technologies as
                described in Section 7 below.
              </li>
            </ul>

            <SubHeading>1.3 Information from Third Parties</SubHeading>
            <ul>
              <li>
                <strong>OAuth providers</strong> — if you sign in with Google or
                another OAuth provider, we receive your name, email address, and
                profile picture from that provider.
              </li>
              <li>
                <strong>Integration partners</strong> — when you connect third-party
                services (e.g., HubSpot, Slack, Asana) to Automex, we receive the
                data necessary to operate those integrations on your behalf.
              </li>
              <li>
                <strong>Publicly available sources</strong> — business directories,
                LinkedIn, and similar sources for sales and marketing purposes.
              </li>
            </ul>
          </Section>

          <Section id="2" title="2. How We Use Your Information">
            <p>We use your information for the following purposes:</p>
            <ul>
              <li>
                <strong>Providing and operating the Services</strong> — to create and
                manage your account, process transactions, authenticate your identity,
                and deliver the features you request.
              </li>
              <li>
                <strong>Improving and developing the Services</strong> — to analyze
                usage patterns, diagnose technical problems, conduct research, and
                build new features.
              </li>
              <li>
                <strong>Communications</strong> — to send transactional messages
                (receipts, security alerts, account notices) and, with your consent,
                marketing emails. You may opt out of marketing at any time.
              </li>
              <li>
                <strong>Customer support</strong> — to respond to inquiries, resolve
                disputes, and troubleshoot issues.
              </li>
              <li>
                <strong>Legal compliance and safety</strong> — to comply with
                applicable laws and regulations, enforce our terms, and protect the
                rights, property, and safety of Automex, our users, and the public.
              </li>
              <li>
                <strong>Fraud prevention and security</strong> — to detect, investigate,
                and prevent fraudulent transactions, abuse, and other illegal activity.
              </li>
            </ul>
            <p>
              We process your personal data under the following legal bases (where
              applicable under US privacy law and international standards):
              <strong> contract performance</strong> (fulfilling our agreement with
              you), <strong>legitimate interests</strong> (improving and securing the
              Services), <strong>legal obligation</strong>, and{" "}
              <strong>consent</strong> (for optional marketing communications).
            </p>
          </Section>

          <Section id="3" title="3. How We Share Your Information">
            <p>
              We do not sell, rent, or trade your personal information. We share it
              only as described below.
            </p>
            <ul>
              <li>
                <strong>Service providers</strong> — third-party vendors who process
                data on our behalf (cloud hosting, payment processing, email delivery,
                analytics, customer support tooling). These vendors are contractually
                bound to protect your data and may not use it for their own purposes.
              </li>
              <li>
                <strong>Integration partners</strong> — when you explicitly connect a
                third-party tool to Automex, we share the data necessary to operate
                that integration. Your use of third-party services is governed by
                their own privacy policies.
              </li>
              <li>
                <strong>Business transfers</strong> — in connection with a merger,
                acquisition, financing, or sale of all or a portion of our assets,
                your data may be transferred as part of that transaction. We will
                notify you via email or prominent notice on our site if such a
                transfer occurs.
              </li>
              <li>
                <strong>Legal requirements</strong> — we may disclose your data if
                required by law, regulation, legal process, or governmental request,
                or to enforce our agreements or protect our rights.
              </li>
              <li>
                <strong>With your consent</strong> — we may share your data for any
                other purpose with your explicit consent.
              </li>
            </ul>
          </Section>

          <Section id="4" title="4. Data Retention">
            <p>
              We retain your personal data for as long as your account is active or
              as needed to provide the Services. Specifically:
            </p>
            <ul>
              <li>
                <strong>Account data</strong> is retained for the life of your account
                and up to <strong>3 years</strong> after closure for dispute resolution,
                fraud prevention, and compliance with our legal obligations.
              </li>
              <li>
                <strong>Financial and transactional records</strong> are retained for
                a minimum of <strong>7 years</strong> as required by US tax and
                accounting regulations.
              </li>
              <li>
                <strong>Marketing data</strong> is retained until you opt out or
                withdraw consent, after which we suppress your contact from future
                campaigns but may retain a record of the opt-out.
              </li>
              <li>
                <strong>Server and security logs</strong> are retained for up to
                <strong> 90 days</strong> and used solely for security and debugging.
              </li>
            </ul>
            <p>
              When data is no longer needed, we securely delete or anonymize it.
            </p>
          </Section>

          <Section id="5" title="5. Security">
            <p>
              We implement commercially reasonable technical and organizational measures
              to protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. These measures include:
            </p>
            <ul>
              <li>TLS 1.2+ encryption in transit and AES-256 encryption at rest.</li>
              <li>Role-based access controls limiting employee access to personal data.</li>
              <li>Regular security assessments and penetration testing.</li>
              <li>
                Multi-factor authentication requirements for internal systems that
                process personal data.
              </li>
            </ul>
            <p>
              No method of transmission over the internet or electronic storage is
              100% secure. We cannot guarantee absolute security; however, we are
              committed to promptly notifying affected users in the event of a data
              breach as required by applicable law, including Washington State's{" "}
              <em>Security Breach Notification Act</em> (RCW 19.255).
            </p>
          </Section>

          <Section id="6" title="6. Your Rights and Choices">
            <p>
              Depending on where you reside, you may have certain rights regarding
              your personal information.
            </p>

            <SubHeading>6.1 Washington State Residents</SubHeading>
            <p>
              Washington's <em>My Health MY Data Act</em> (MHMD) and the{" "}
              <em>Washington Privacy Act</em> (WPA) provide residents with rights
              to access, correct, and delete certain personal data. Automex honors
              these rights for all users regardless of state.
            </p>

            <SubHeading>6.2 California Residents (CCPA / CPRA)</SubHeading>
            <p>
              California residents have the right to: (a) know what personal
              information we collect and how we use and share it; (b) delete personal
              information we hold about you; (c) opt out of the sale or sharing of
              personal information (we do not sell personal information); (d) correct
              inaccurate personal information; and (e) limit use of sensitive personal
              information. To exercise these rights, contact us at{" "}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We will not discriminate
              against you for exercising your rights.
            </p>

            <SubHeading>6.3 All Users</SubHeading>
            <ul>
              <li>
                <strong>Access &amp; portability</strong> — you may request a copy of
                the personal data we hold about you in a structured, machine-readable
                format.
              </li>
              <li>
                <strong>Correction</strong> — you may update or correct inaccurate
                data through your account settings or by contacting us.
              </li>
              <li>
                <strong>Deletion</strong> — you may request deletion of your personal
                data. We will fulfill your request unless retention is required by law
                or for legitimate business purposes (e.g., fraud prevention).
              </li>
              <li>
                <strong>Opt out of marketing</strong> — you may unsubscribe from
                marketing emails at any time by clicking "Unsubscribe" in any email
                or contacting us directly.
              </li>
              <li>
                <strong>Account closure</strong> — you may close your account at any
                time through the account settings page.
              </li>
            </ul>
            <p>
              To submit a rights request, email{" "}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> with the subject line
              "Privacy Rights Request." We will respond within{" "}
              <strong>45 days</strong> (with up to a 45-day extension where
              reasonably necessary).
            </p>
          </Section>

          <Section id="7" title="7. Cookies and Tracking Technologies">
            <p>We use the following types of cookies and similar technologies:</p>
            <ul>
              <li>
                <strong>Strictly necessary cookies</strong> — required for the
                Services to function (session management, authentication, security).
                These cannot be disabled.
              </li>
              <li>
                <strong>Analytics cookies</strong> — help us understand how users
                interact with the Services (e.g., page views, session duration). We
                use tools such as Google Analytics with IP anonymization enabled.
              </li>
              <li>
                <strong>Preference cookies</strong> — remember your settings (e.g.,
                language, theme) so you do not have to set them on every visit.
              </li>
              <li>
                <strong>Marketing cookies</strong> — used with your consent to
                deliver relevant advertisements. We do not use third-party ad networks
                without your explicit consent.
              </li>
            </ul>
            <p>
              You can control cookies through your browser settings. Disabling certain
              cookies may affect the functionality of the Services. We honor
              browser-based "Do Not Track" (DNT) signals to the extent technically
              feasible.
            </p>
          </Section>

          <Section id="8" title="8. Third-Party Links and Services">
            <p>
              The Services may contain links to third-party websites, integrations, or
              services that are not operated by Automex. We are not responsible for the
              privacy practices of any third party. We encourage you to review the
              privacy policy of every site or service you visit.
            </p>
          </Section>

          <Section id="9" title="9. Children's Privacy (COPPA)">
            <p>
              The Services are not directed to children under the age of{" "}
              <strong>13</strong>. We do not knowingly collect personal information
              from children under 13. If you are a parent or guardian and believe
              your child has provided us with personal information, please contact us
              at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. If we discover we have
              collected personal information from a child under 13, we will promptly
              delete it in accordance with the{" "}
              <em>Children's Online Privacy Protection Act</em> (COPPA).
            </p>
          </Section>

          <Section id="10" title="10. International Users">
            <p>
              Automex is headquartered in the United States. If you access the Services
              from outside the United States, your information will be transferred to,
              stored, and processed in the United States or other countries where our
              service providers operate. By using the Services, you consent to this
              transfer. We take steps to ensure that your data receives an adequate
              level of protection wherever it is processed.
            </p>
          </Section>

          <Section id="11" title="11. Changes to This Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time. When we make
              material changes, we will notify you by:
            </p>
            <ul>
              <li>
                Posting the updated policy on this page with a revised "Effective
                date" at the top.
              </li>
              <li>
                Sending an email notice to the address associated with your account
                at least <strong>30 days</strong> before the changes take effect.
              </li>
            </ul>
            <p>
              Your continued use of the Services after the effective date constitutes
              your acceptance of the revised policy. If you do not agree to the
              changes, you must stop using the Services and may request account
              deletion.
            </p>
          </Section>

          <Section id="12" title="12. Contact Us">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy
              Policy or our data practices, please contact us:
            </p>
            <address className="not-italic mt-4 rounded-xl border border-border/50 bg-muted/30 p-5 text-sm leading-7 text-foreground">
              <strong>{COMPANY}</strong>
              <br />
              Privacy &amp; Data Compliance
              <br />
              {ADDRESS}
              <br />
              Email:{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="text-primary hover:underline"
              >
                {EMAIL}
              </a>
              <br />
              Website:{" "}
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
              We are committed to resolving complaints about your privacy and our
              collection or use of your personal information. If you have an
              unresolved privacy or data use concern that we have not addressed
              satisfactorily, please contact us at the email above.
            </p>
          </Section>

          {/* Footer note */}
          <div className="mt-12 rounded-xl border border-border/40 bg-muted/20 p-5 text-xs leading-6 text-muted-foreground">
            <strong>Legal notice:</strong> This Privacy Policy is provided for
            informational purposes and constitutes a binding agreement between you and
            {COMPANY}. It is governed by the laws of the State of Washington, United
            States, without regard to its conflict-of-law provisions. Any disputes
            arising under this policy shall be resolved exclusively in the state or
            federal courts located in King County, Washington.
          </div>

        </div>

        {/* Bottom nav */}
        <div className="mt-12 flex flex-wrap gap-4 border-t border-border/40 pt-8 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground hover:underline">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-foreground hover:underline">
            Contact Us
          </Link>
          <Link href="/" className="hover:text-foreground hover:underline">
            Back to Home
          </Link>
        </div>

      </div>

      {/* Minimal prose styles scoped to this page */}
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
  );
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

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
// i18n/routing.ts

import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'es', 'de', 'fr', 'zh', 'ar'],
  defaultLocale: 'en',

  pathnames: {
    '/': '/',

    // ─── Dashboard ──────────────────────────────────────────────────────────
    '/dashboard': {
      en: '/dashboard',
      es: '/dashboard',
      de: '/dashboard',
      fr: '/dashboard',
      zh: '/dashboard',
      ar: '/dashboard',
    },
    '/dashboard/requests': {
      en: '/dashboard/requests',
      es: '/dashboard/requests',
      de: '/dashboard/requests',
      fr: '/dashboard/requests',
      zh: '/dashboard/requests',
      ar: '/dashboard/requests',
    },
    '/dashboard/requests/[id]': {
      en: '/dashboard/requests/[id]',
      es: '/dashboard/requests/[id]',
      de: '/dashboard/requests/[id]',
      fr: '/dashboard/requests/[id]',
      zh: '/dashboard/requests/[id]',
      ar: '/dashboard/requests/[id]',
    },
    '/dashboard/bookings': {
      en: '/dashboard/bookings',
      es: '/dashboard/bookings',
      de: '/dashboard/bookings',
      fr: '/dashboard/bookings',
      zh: '/dashboard/bookings',
      ar: '/dashboard/bookings',
    },
    '/dashboard/bookings/[id]': {
      en: '/dashboard/bookings/[id]',
      es: '/dashboard/bookings/[id]',
      de: '/dashboard/bookings/[id]',
      fr: '/dashboard/bookings/[id]',
      zh: '/dashboard/bookings/[id]',
      ar: '/dashboard/bookings/[id]',
    },
    '/dashboard/support': {
      en: '/dashboard/support',
      es: '/dashboard/support',
      de: '/dashboard/support',
      fr: '/dashboard/support',
      zh: '/dashboard/support',
      ar: '/dashboard/support',
    },
    '/dashboard/support/[id]': {
      en: '/dashboard/support/[id]',
      es: '/dashboard/support/[id]',
      de: '/dashboard/support/[id]',
      fr: '/dashboard/support/[id]',
      zh: '/dashboard/support/[id]',
      ar: '/dashboard/support/[id]',
    },
    '/dashboard/notifications': {
      en: '/dashboard/notifications',
      es: '/dashboard/notifications',
      de: '/dashboard/notifications',
      fr: '/dashboard/notifications',
      zh: '/dashboard/notifications',
      ar: '/dashboard/notifications',
    },
    '/dashboard/profile': {
      en: '/dashboard/profile',
      es: '/dashboard/profile',
      de: '/dashboard/profile',
      fr: '/dashboard/profile',
      zh: '/dashboard/profile',
      ar: '/dashboard/profile',
    },
    '/dashboard/security': {
      en: '/dashboard/security',
      es: '/dashboard/security',
      de: '/dashboard/security',
      fr: '/dashboard/security',
      zh: '/dashboard/security',
      ar: '/dashboard/security',
    },
    '/dashboard/calculations': {
      en: '/dashboard/calculations',
      es: '/dashboard/calculations',
      de: '/dashboard/calculations',
      fr: '/dashboard/calculations',
      zh: '/dashboard/calculations',
      ar: '/dashboard/calculations',
    },
    '/dashboard/conversations': {
      en: '/dashboard/conversations',
      es: '/dashboard/conversations',
      de: '/dashboard/conversations',
      fr: '/dashboard/conversations',
      zh: '/dashboard/conversations',
      ar: '/dashboard/conversations',
    },

    // ─── Admin ──────────────────────────────────────────────────────────────
    '/admin': '/admin',


    // ─── About & Contact pages ──────────────────────────────────────────────────────────
    '/about': {
      en: '/about',
      es: '/about',
      de: '/about',
      fr: '/about',
      zh: '/about',
      ar: '/about',
    },
    '/contact': {
      en: '/contact',
      es: '/contact',
      de: '/contact',
      fr: '/contact',
      zh: '/contact',
      ar: '/contact',
    },

    // ─── Auth pages ──────────────────────────────────────────────────────
    '/sign-in': {
      en: '/sign-in',
      es: '/sign-in',
      de: '/sign-in',
      fr: '/sign-in',
      zh: '/sign-in',
      ar: '/sign-in',
    },
    '/sign-up': {
      en: '/sign-up',
      es: '/sign-up',
      de: '/sign-up',
      fr: '/sign-up',
      zh: '/sign-up',
      ar: '/sign-up',
    },
    '/forgot-password': {
      en: '/forgot-password',
      es: '/forgot-password',
      de: '/forgot-password',
      fr: '/forgot-password',
      zh: '/forgot-password',
      ar: '/forgot-password',
    },
    '/reset-password': {
      en: '/reset-password',
      es: '/reset-password',
      de: '/reset-password',
      fr: '/reset-password',
      zh: '/reset-password',
      ar: '/reset-password',
    },
    '/verify-email': {
      en: '/verify-email',
      es: '/verify-email',
      de: '/verify-email',
      fr: '/verify-email',
      zh: '/verify-email',
      ar: '/verify-email',
    },
    '/magic-link': {
      en: '/magic-link',
      es: '/magic-link',
      de: '/magic-link',
      fr: '/magic-link',
      zh: '/magic-link',
      ar: '/magic-link',
    },

    // ─── Legal pages ──────────────────────────────────────────────────────
    '/terms': {
      en: '/terms',
      es: '/terms',
      de: '/terms',
      fr: '/terms',
      zh: '/terms',
      ar: '/terms',
    },
    '/privacy': {
      en: '/privacy',
      es: '/privacy',
      de: '/privacy',
      fr: '/privacy',
      zh: '/privacy',
      ar: '/privacy',
    },

    // ─── CRM pages ──────────────────────────────────────────────────────────
    '/crm': {
      en: '/crm',
      es: '/crm',
      de: '/crm',
      fr: '/crm',
      zh: '/crm',
      ar: '/crm',
    },
    '/crm/book-a-call': {
      en: '/crm/book-a-call',
      es: '/crm/book-a-call',
      de: '/crm/book-a-call',
      fr: '/crm/book-a-call',
      zh: '/crm/book-a-call',
      ar: '/crm/book-a-call',
    },
    '/crm/contact-sales': {
      en: '/crm/contact-sales',
      es: '/crm/contact-sales',
      de: '/crm/contact-sales',
      fr: '/crm/contact-sales',
      zh: '/crm/contact-sales',
      ar: '/crm/contact-sales',
    },
    '/crm/quote': {
      en: '/crm/quote',
      es: '/crm/quote',
      de: '/crm/quote',
      fr: '/crm/quote',
      zh: '/crm/quote',
      ar: '/crm/quote',
    },


    // ─── Service pages ──────────────────────────────────────────────────────────
    '/services': {
      en: '/services',
      es: '/services',
      de: '/services',
      fr: '/services',
      zh: '/services',
      ar: '/services',
    },
    '/services/[slug]': {
      en: '/services/[slug]',
      es: '/services/[slug]',
      de: '/services/[slug]',
      fr: '/services/[slug]',
      zh: '/services/[slug]',
      ar: '/services/[slug]',
    },

    // ─── Industries ───────────────────────────────────────────────────────
    '/industries': {
      en: '/industries',
      es: '/industries',
      de: '/industries',
      fr: '/industries',
      zh: '/industries',
      ar: '/industries',
    },
    '/industries/[slug]': {
      en: '/industries/[slug]',
      es: '/industries/[slug]',
      de: '/industries/[slug]',
      fr: '/industries/[slug]',
      zh: '/industries/[slug]',
      ar: '/industries/[slug]',
    },


    // ─── Blog pages ──────────────────────────────────────────────────────────
    '/blog': {
      en: '/blog',
      es: '/blog',
      de: '/blog',
      fr: '/blog',
      zh: '/blog',
      ar: '/blog',
    },
    '/blog/[slug]': {
      en: '/blog/[slug]',
      es: '/blog/[slug]',
      de: '/blog/[slug]',
      fr: '/blog/[slug]',
      zh: '/blog/[slug]',
      ar: '/blog/[slug]',
    },


    // ─── Case Studies pages ──────────────────────────────────────────────────────────
    '/case-studies': {
      en: '/case-studies',
      es: '/case-studies',
      de: '/case-studies',
      fr: '/case-studies',
      zh: '/case-studies',
      ar: '/case-studies',
    },
    '/case-studies/[slug]': {
      en: '/case-studies/[slug]',
      es: '/case-studies/[slug]',
      de: '/case-studies/[slug]',
      fr: '/case-studies/[slug]',
      zh: '/case-studies/[slug]',
      ar: '/case-studies/[slug]',
    },


    // ─── Portfolio pages ──────────────────────────────────────────────────────────
    '/portfolio': {
      en: '/portfolio',
      es: '/portfolio',
      de: '/portfolio',
      fr: '/portfolio',
      zh: '/portfolio',
      ar: '/portfolio',
    },
    '/portfolio/[slug]': {
      en: '/portfolio/[slug]',
      es: '/portfolio/[slug]',
      de: '/portfolio/[slug]',
      fr: '/portfolio/[slug]',
      zh: '/portfolio/[slug]',
      ar: '/portfolio/[slug]',
    },


    // ─── Partner pages ──────────────────────────────────────────────────────────
    '/partners': {
      en: '/partners',
      es: '/partners',
      de: '/partners',
      fr: '/partners',
      zh: '/partners',
      ar: '/partners',
    },
    '/partners/[slug]': {
      en: '/partners/[slug]',
      es: '/partners/[slug]',
      de: '/partners/[slug]',
      fr: '/partners/[slug]',
      zh: '/partners/[slug]',
      ar: '/partners/[slug]',
    },


    // ─── Tech Expertise pages ─────────────────────────────────────────────────
    '/tech-expertise': {
      en: '/tech-expertise',
      es: '/tech-expertise',
      de: '/tech-expertise',
      fr: '/tech-expertise',
      zh: '/tech-expertise',
      ar: '/tech-expertise',
    },
    '/tech-expertise/[slug]': {
      en: '/tech-expertise/[slug]',
      es: '/tech-expertise/[slug]',
      de: '/tech-expertise/[slug]',
      fr: '/tech-expertise/[slug]',
      zh: '/tech-expertise/[slug]',
      ar: '/tech-expertise/[slug]',
    },


    // ─── Solutions pages ─────────────────────────────────────────────────────
    '/solutions/ai-capabilities': {
      en: '/solutions/ai-capabilities',
      es: '/solutions/ai-capabilities',
      de: '/solutions/ai-capabilities',
      fr: '/solutions/ai-capabilities',
      zh: '/solutions/ai-capabilities',
      ar: '/solutions/ai-capabilities',
    },
    '/solutions/ai-capabilities/[slug]': {
      en: '/solutions/ai-capabilities/[slug]',
      es: '/solutions/ai-capabilities/[slug]',
      de: '/solutions/ai-capabilities/[slug]',
      fr: '/solutions/ai-capabilities/[slug]',
      zh: '/solutions/ai-capabilities/[slug]',
      ar: '/solutions/ai-capabilities/[slug]',
    },

    // ─── Faq pages ──────────────────────────────────────────────────────────
    '/faqs': {
      en: '/faqs',
      es: '/faqs',
      de: '/faqs',
      fr: '/faqs',
      zh: '/faqs',
      ar: '/faqs',
    },
  },
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

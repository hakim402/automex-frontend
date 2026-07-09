// lib/seo/organization.ts
export const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AUTOMEX",
  url: "https://automex.tech",
  logo: "https://automex.tech/logo/automex.png",
  description:
    "AUTOMEX is a technology company specializing in AI solutions, software development, digital transformation, and business automation services.",
  telephone: "+93 776320765",
  address: {
    "@type": "PostalAddress",
    streetAddress: "4911 Talbot Rd S",
    addressLocality: "Renton",
    addressRegion: "WA",
    postalCode: "98055",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+93 776320765",
    contactType: "Sales",
    availableLanguage: ["English", "Spanish", "German", "French", "Italian", "Dutch", "Chinese", "Arabic", "Persian", "Pashto"],
  },
  sameAs: [
    // Add social media URLs when available
    // "https://linkedin.com/company/automex",
    // "https://twitter.com/automex",
  ],
};

export const localBusinessData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "AUTOMEX",
  description:
    "AI solutions, software development, and digital transformation services.",
  url: "https://automex.tech",
  logo: "https://automex.tech/logo/automex.png",
  telephone: "+93 776320765",
  email: "info@automex.tech",
  address: {
    "@type": "PostalAddress",
    streetAddress: "4911 Talbot Rd S",
    addressLocality: "Renton",
    addressRegion: "WA",
    postalCode: "98055",
    addressCountry: "US",
  },
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
};
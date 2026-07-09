// app/[locale]/(auth)/layout.tsx

import { getLocale } from "next-intl/server";

// ─────────────────────────────────────────────────────────────────────────────

const RTL_LOCALES = ["ar", "fa", "ps"];

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const isRtl = RTL_LOCALES.includes(locale);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen w-full bg-background flex"
    >
      <main
        className="flex-1 flex flex-col items-center justify-center
                   min-h-screen px-5 py-12 sm:px-8 lg:px-12 xl:px-16
                   bg-background relative overflow-hidden"
      >
        {/* Subtle ambient glow — matches brand palette, invisible in light mode */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10
                     bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgb(10_184_251/6%),transparent)]
                     dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgb(10_184_251/5%),transparent)]"
        />

        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}

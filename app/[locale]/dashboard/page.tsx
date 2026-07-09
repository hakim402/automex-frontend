"use client";

// app/[locale]/dashboard/page.tsx

import { GreetingBanner } from "./_components/GreetingBanner";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <GreetingBanner />
    </div>
  );
}
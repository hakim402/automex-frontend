// app/[locale]/dashboard/layout.tsx

import { SidebarProvider } from "@/contexts/sidebar-context";
import { Sidebar }         from "./_components/Sidebar/Sidebar";
import { DashboardMain }   from "./_components/DashboardMain";
import { getLocale }       from "next-intl/server";

const RTL_LOCALES = new Set(["ar", "fa", "ps"]);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const isRtl  = RTL_LOCALES.has(locale);

  return (
    <SidebarProvider>
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="flex min-h-screen bg-background"
      >
        <Sidebar isRtl={isRtl} />
        <DashboardMain>{children}</DashboardMain>
      </div>
    </SidebarProvider>
  );
}
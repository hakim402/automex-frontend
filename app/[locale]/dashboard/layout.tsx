import { SidebarProvider } from "@/contexts/sidebar-context";
import { Sidebar } from "./_components/Sidebar/Sidebar";
import { DashboardMain } from "./_components/DashboardMain";  // new file
import { getLocale } from "next-intl/server";

const RTL_LOCALES = ["ar", "fa", "ps"];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const isRtl = RTL_LOCALES.includes(locale);

  return (
    <SidebarProvider>
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="min-h-screen bg-background flex"
      >
        <Sidebar />
        <DashboardMain>{children}</DashboardMain>
      </div>
    </SidebarProvider>
  );
}
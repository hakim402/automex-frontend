// app/[locale]/(routes)/layout.tsx
//
// Route-group layout for all public content pages.
// Renders the HeaderWrapper (which fetches nav categories server-side)
// above every page in this group, so individual pages don't need to
// import the header themselves.

import { ReactNode } from "react";
import { HeaderWrapper } from "../_components/Header/HeaderWrapper";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RoutesLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <>
      <HeaderWrapper locale={locale} />
      {children}
    </>
  );
}

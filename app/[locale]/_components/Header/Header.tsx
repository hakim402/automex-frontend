"use client";

// app/[locale]/_components/Header/Header.tsx

import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeToggle } from "../Theme/theme-toggle";
import { LanguageSwitcher } from "../Language/LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const t = useTranslations("Header");
  const locale = useLocale();
  const { user, loading, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isRtl = ["ar", "fa", "ps"].includes(locale);
  const isAuthenticated = !!user && !loading;

  // ✅ Use 'as const' to preserve literal types for href
  const menuItems = [
    { name: t("home"), href: "/" as const },
    { name: t("about"), href: "/about" as const },
    { name: t("contact"), href: "/contact" as const },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <header>
      <nav
        dir={isRtl ? "rtl" : "ltr"}
        className={cn(
          "fixed top-4 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-border/40 backdrop-blur-lg border-b shadow-sm top-0 p-4"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/automex-dark.png"
                alt="Automex Logo"
                width={120}
                height={50}
                className="block dark:hidden h-40 md:h-48 lg:h-52 xl:h-52 w-auto object-contain -ml-4 md:ml-0 lg:ml-4 xl:ml-0"
                priority
              />
              <Image
                src="/logo/automex-light.png"
                alt="Automex Logo"
                width={120}
                height={50}
                className="hidden dark:block h-40 md:h-48 lg:h-52 xl:h-52 w-auto object-contain -ml-4 md:ml-0 lg:ml-4 xl:ml-0"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-6">
              {menuItems.map((item) => (
                <Button key={item.href} asChild variant="ghost" size="sm">
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />

              {!loading && (
                <>
                  {!isAuthenticated ? (
                    <>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="hidden sm:inline-flex border border-input hover:bg-accent hover:text-accent-foreground"
                      >
                        <Link href="/sign-in">{t("login")}</Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="hidden sm:inline-flex bg-color text-white shadow-brand hover:opacity-90"
                      >
                        <Link href="/sign-up">{t("signUp")}</Link>
                      </Button>
                    </>
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      className="hidden sm:inline-flex bg-color text-white shadow-brand hover:opacity-90"
                    >
                      <Link href="/dashboard">{t("dashboard")}</Link>
                    </Button>
                  )}
                </>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={cn(
            "absolute left-0 right-0 top-16 bg-background border-border border-b shadow-lg transition-all duration-300 lg:hidden",
            menuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none",
          )}
        >
          <div className="container mx-auto px-4 py-6 space-y-4">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {!loading && (
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                {!isAuthenticated ? (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                        {t("login")}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-color text-white shadow-brand hover:opacity-90"
                    >
                      <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                        {t("signUp")}
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      className="w-full bg-color text-white shadow-brand hover:opacity-90"
                    >
                      <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                        {t("dashboard")}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4 me-2" />
                      {t("logout")}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
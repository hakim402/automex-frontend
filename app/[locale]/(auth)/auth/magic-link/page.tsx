"use client";

// app/[locale]/(auth)/magic-link/page.tsx

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Loader2, XCircle } from "lucide-react";
import Head from "next/head";

import { Link } from "@/i18n/routing";
import { verifyMagicLink, getMe, getErrorMessage } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BackToHome } from "../../_components/BackToHome";

type State = "loading" | "error";

export default function MagicLinkPage() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const { setUser } = useAuth();

  const [state, setState] = useState<State>("loading");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setState("error");
      setErrMsg(t("magicLink.noToken"));
      return;
    }

    verifyMagicLink(token)
      .then(async () => {
        const user = await getMe();
        setUser(user);
        router.replace(`/${locale}/dashboard`);
      })
      .catch((err) => {
        setState("error");
        setErrMsg(getErrorMessage(err));
      });
  }, [searchParams, locale, router, setUser, t]);

  return (
    <>
      <Head>
        <title>{t("magicLink.metaTitle")}</title>
        <meta name="description" content={t("magicLink.metaDescription")} />
      </Head>

      <div className="flex flex-col min-h-screen items-center justify-center px-5 py-12 bg-background">
        <BackToHome />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm p-8 flex flex-col items-center text-center gap-6"
        >
          {state === "loading" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-2xl bg-accent">
                <Loader2 className="size-8 text-primary animate-spin" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground mb-2">{t("magicLink.loadingTitle")}</h1>
                <p className="text-[14px] text-muted-foreground">{t("magicLink.loadingDescription")}</p>
              </div>
            </>
          )}

          {state === "error" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
                <XCircle className="size-8 text-destructive" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground mb-2">{t("magicLink.errorTitle")}</h1>
                <p className="text-[14px] leading-6 text-muted-foreground">
                  {errMsg || t("magicLink.errorDefault")}
                </p>
              </div>
              <Button
                asChild
                className="w-full rounded-full bg-color shadow-brand hover:-translate-y-0.5 transition-transform duration-200 font-semibold"
              >
                <Link href="/sign-in">{t("magicLink.backToSignIn")}</Link>
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
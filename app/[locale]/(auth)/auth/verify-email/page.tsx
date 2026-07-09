"use client";

// app/[locale]/(auth)/verify-email/page.tsx

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Head from "next/head";

import { Link } from "@/i18n/routing";
import { verifyEmail, getErrorMessage } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { BackToHome } from "../../_components/BackToHome";

type VerifyState = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();

  const [state, setState] = useState<VerifyState>("loading");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setState("error");
      setErrMsg(t("verifyEmail.noToken"));
      return;
    }

    verifyEmail(token)
      .then(() => setState("success"))
      .catch((err) => {
        setState("error");
        setErrMsg(getErrorMessage(err));
      });
  }, [searchParams, t]);

  return (
    <>
      <Head>
        <title>{t("verifyEmail.metaTitle")}</title>
        <meta name="description" content={t("verifyEmail.metaDescription")} />
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
                <h1 className="text-xl font-bold text-foreground mb-2">{t("verifyEmail.loadingTitle")}</h1>
                <p className="text-[14px] text-muted-foreground">{t("verifyEmail.loadingDescription")}</p>
              </div>
            </>
          )}

          {state === "success" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-2xl bg-color shadow-brand">
                <CheckCircle className="size-8 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground mb-2">{t("verifyEmail.successTitle")}</h1>
                <p className="text-[14px] leading-6 text-muted-foreground">{t("verifyEmail.successDescription")}</p>
              </div>
              <Button
                asChild
                className="w-full rounded-full bg-color shadow-brand hover:-translate-y-0.5 transition-transform duration-200 font-semibold"
              >
                <Link href="/sign-in">{t("verifyEmail.signIn")}</Link>
              </Button>
            </>
          )}

          {state === "error" && (
            <>
              <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
                <XCircle className="size-8 text-destructive" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground mb-2">{t("verifyEmail.errorTitle")}</h1>
                <p className="text-[14px] leading-6 text-muted-foreground">
                  {errMsg || t("verifyEmail.errorDefault")}
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Button
                  asChild
                  className="w-full rounded-full bg-color shadow-brand hover:-translate-y-0.5 transition-transform duration-200 font-semibold"
                >
                  <Link href="/sign-in">{t("verifyEmail.goToSignIn")}</Link>
                </Button>
                <Link
                  href="/sign-up"
                  className="text-[13px] text-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("verifyEmail.createAccount")}
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
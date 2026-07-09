"use client";

// app/[locale]/(auth)/_components/BackToHome.tsx

import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function BackToHome() {
  const t = useTranslations("Auth");

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px]
                   text-muted-foreground hover:text-foreground
                   transition-colors duration-200 group"
      >
        <ArrowLeft
          className="size-3.5 transition-transform duration-200
                     group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        {t("common.backHome")}
      </Link>
    </motion.div>
  );
}

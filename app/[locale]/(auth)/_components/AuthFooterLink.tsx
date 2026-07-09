"use client";

// app/[locale]/(auth)/_components/AuthFooterLink.tsx

import type { ComponentProps } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

interface AuthFooterLinkProps {
  text: string;
  linkLabel: string;
  href: ComponentProps<typeof Link>["href"];
}

export function AuthFooterLink({ text, linkLabel, href }: AuthFooterLinkProps) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mt-6 text-center text-[13px] text-muted-foreground"
    >
      {text}{" "}
      <Link
        href={href}
        className="font-semibold text-primary hover:underline underline-offset-4
                   transition-colors duration-200"
      >
        {linkLabel}
      </Link>
    </motion.p>
  );
}

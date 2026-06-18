/**
 * DangerZoneCard.tsx — Destructive actions section
 *
 * Actions:
 *   • Sign out all other devices (revoke all sessions except current)
 *   • Delete account — confirmation dialog with typed-name guard
 *
 * "Delete account" is a two-step confirm:
 *   Step 1 → show warning + "I understand" checkbox
 *   Step 2 → user types their full name, then confirm button activates
 *
 * NOTE: Account deletion endpoint is not in the current backend spec.
 * The button is rendered but shows a "contact support" toast until the
 * endpoint is available. Replace the handler when the endpoint is ready.
 */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import {
  AlertTriangle,
  LogOut,
  Trash2,
  Loader2,
  ShieldOff,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  getActiveSessions,
  revokeSession,
  logout,
  getErrorMessage,
  type User,
} from "@/lib/auth";
import { SectionCard } from "../../profile/_components/SectionCard";
import { cn } from "@/lib/utils";

interface DangerZoneCardProps {
  user: User;
}

export function DangerZoneCard({ user }: DangerZoneCardProps) {
  const t = useTranslations("Security");
  const router = useRouter();
  const locale = useLocale();

  const [signingOutAll, setSigningOutAll] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const nameMatches = confirmName.trim() === user.full_name.trim();

  // ── Sign out all other sessions ────────────────────────────────────────────
  async function handleSignOutAll() {
    setSigningOutAll(true);
    try {
      const { sessions } = await getActiveSessions();

      // Sort by last_used desc → first is current session
      const sorted = [...sessions].sort(
        (a, b) =>
          new Date(b.last_used_at).getTime() -
          new Date(a.last_used_at).getTime(),
      );
      const others = sorted.slice(1); // keep most-recent (current)

      await Promise.all(others.map((s) => revokeSession(s.id)));
      toast.success(t("allOtherSignedOut", { count: others.length }));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSigningOutAll(false);
    }
  }

  // ── Delete account ─────────────────────────────────────────────────────────
  async function handleDeleteAccount() {
    if (!nameMatches) return;
    setDeleting(true);

    // TODO: replace with real DELETE /auth/me/ endpoint when available
    toast.info(t("deleteContactSupport"));
    setDeleting(false);
    setDeleteOpen(false);

    /*
     * When endpoint is ready:
     *
     * try {
     *   await authRequest("/auth/me/", { method: "DELETE" });
     *   await logout();
     *   router.replace(`/${locale}/`);
     * } catch (err) {
     *   toast.error(getErrorMessage(err));
     * }
     */
  }

  return (
    <>
      <SectionCard
        icon={ShieldOff}
        title={t("sectionDanger")}
        description={t("sectionDangerDesc")}
        delay={0.3}
        className="border-destructive/20"
      >
        <div className="space-y-4">
          {/* ── Sign out all other devices ── */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between
                          gap-4 rounded-xl border border-border/50 bg-card/50 p-4"
          >
            <div className="flex items-start gap-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center
                              rounded-xl bg-amber-500/10 mt-0.5"
              >
                <LogOut className="size-4 text-amber-500" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  {t("signOutAllTitle")}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {t("signOutAllDesc")}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOutAll}
              disabled={signingOutAll}
              className="shrink-0 rounded-lg border-amber-500/30 text-amber-600
                         dark:text-amber-400 hover:bg-amber-500/10
                         hover:border-amber-500/40 gap-1.5"
            >
              {signingOutAll ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <LogOut className="size-3.5" />
              )}
              {t("signOutAllBtn")}
            </Button>
          </div>

          {/* ── Delete account ── */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between
                          gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4"
          >
            <div className="flex items-start gap-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center
                              rounded-xl bg-destructive/10 mt-0.5"
              >
                <Trash2 className="size-4 text-destructive" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  {t("deleteAccountTitle")}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {t("deleteAccountDesc")}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDeleteOpen(true);
                setUnderstood(false);
                setConfirmName("");
              }}
              className="shrink-0 rounded-lg border-destructive/30 text-destructive
                         hover:bg-destructive/10 hover:border-destructive/40 gap-1.5"
            >
              <Trash2 className="size-3.5" />
              {t("deleteAccountBtn")}
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* ── Delete confirmation dialog ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <div
              className="flex size-12 items-center justify-center
                            rounded-2xl bg-destructive/10 mb-2"
            >
              <AlertTriangle className="size-6 text-destructive" />
            </div>
            <DialogTitle className="text-lg font-bold">
              {t("deleteDialogTitle")}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground leading-6">
              {t("deleteDialogDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Understand checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={understood}
                onCheckedChange={(v) => setUnderstood(v === true)}
                className="mt-0.5"
              />
              <span className="text-[13px] text-foreground leading-5">
                {t("deleteUnderstandCheck")}
              </span>
            </label>

            {/* Type name confirmation */}
            {understood && (
              <div className="space-y-1.5">
                <p className="text-[12px] text-muted-foreground">
                  {t("deleteTypeNamePrompt")}{" "}
                  <span className="font-semibold text-foreground">
                    {user.full_name}
                  </span>
                </p>
                <Input
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  placeholder={user.full_name}
                  className={cn(
                    "transition-colors",
                    confirmName.length > 0 &&
                      (nameMatches
                        ? "border-emerald-500/50 focus-visible:ring-emerald-500/20"
                        : "border-destructive/50"),
                  )}
                />
                {nameMatches && (
                  <p className="text-[12px] text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="size-3" />
                    {t("deleteNameMatch")}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="rounded-lg"
            >
              {t("cancel")}
            </Button>
            <Button
              disabled={!understood || !nameMatches || deleting}
              onClick={handleDeleteAccount}
              className="rounded-lg bg-destructive text-white
                         hover:bg-destructive/90 gap-1.5"
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  {t("deleteConfirmBtn")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

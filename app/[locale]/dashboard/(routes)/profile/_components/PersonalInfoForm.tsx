/**
 * PersonalInfoForm.tsx — Edit full_name + profile fields
 *
 * Fields:
 *   Top level:  full_name
 *   profile.*:  bio, phone_number, date_of_birth,
 *               address_line1, address_line2, city,
 *               state_province, postal_code, country
 *
 * On save → PATCH /auth/me/update/ → reloadUser() to sync AuthContext.
 */
"use client";

import { useEffect }       from "react";
import { useForm }         from "react-hook-form";
import { zodResolver }     from "@hookform/resolvers/zod";
import { z }               from "zod";
import { useTranslations } from "next-intl";
import { toast }           from "sonner";
import { Loader2, Save, User, MapPin, Phone, FileText, Calendar } from "lucide-react";
import { motion }          from "framer-motion";

import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateMe, getErrorMessage, type User as UserType } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { SectionCard }   from "./SectionCard";
import { FormRow }       from "./FormRow";

// ─── Country list (ISO 3166-1 alpha-2 subset) ────────────────────────────────

const COUNTRIES = [
  { code: "AF", name: "Afghanistan" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "CN", name: "China" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "IR", name: "Iran" },
  { code: "PK", name: "Pakistan" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "US", name: "United States" },
  { code: "AE", name: "United Arab Emirates" },
] as const;

// ─── Timezone list ────────────────────────────────────────────────────────────

const TIMEZONES = [
  "UTC", "America/New_York", "America/Los_Angeles", "America/Chicago",
  "Europe/London", "Europe/Paris", "Europe/Berlin",
  "Asia/Dubai", "Asia/Karachi", "Asia/Kabul",
  "Asia/Tehran", "Asia/Kolkata", "Asia/Shanghai",
  "Australia/Sydney",
];

// ─── Zod schema ───────────────────────────────────────────────────────────────

const schema = z.object({
  full_name:      z.string().min(2, "Full name must be at least 2 characters"),
  bio:            z.string().max(300, "Bio must be under 300 characters").optional(),
  phone_number:   z.string().max(20).optional(),
  date_of_birth:  z.string().optional(),
  address_line1:  z.string().max(100).optional(),
  address_line2:  z.string().max(100).optional(),
  city:           z.string().max(60).optional(),
  state_province: z.string().max(60).optional(),
  postal_code:    z.string().max(20).optional(),
  country:        z.string().max(2).optional(),
  timezone:       z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─────────────────────────────────────────────────────────────────────────────

interface PersonalInfoFormProps {
  user: UserType;
}

export function PersonalInfoForm({ user }: PersonalInfoFormProps) {
  const t            = useTranslations("Profile");
  const { reloadUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name:      user.full_name,
      bio:            user.profile.bio            ?? "",
      phone_number:   user.profile.phone_number   ?? "",
      date_of_birth:  user.profile.date_of_birth  ?? "",
      address_line1:  user.profile.address_line1  ?? "",
      address_line2:  user.profile.address_line2  ?? "",
      city:           user.profile.city           ?? "",
      state_province: user.profile.state_province ?? "",
      postal_code:    user.profile.postal_code    ?? "",
      country:        user.profile.country        ?? "",
      timezone:       user.profile.timezone       ?? "UTC",
    },
  });

  // Keep form in sync if user object changes externally
  useEffect(() => {
    reset({
      full_name:      user.full_name,
      bio:            user.profile.bio            ?? "",
      phone_number:   user.profile.phone_number   ?? "",
      date_of_birth:  user.profile.date_of_birth  ?? "",
      address_line1:  user.profile.address_line1  ?? "",
      address_line2:  user.profile.address_line2  ?? "",
      city:           user.profile.city           ?? "",
      state_province: user.profile.state_province ?? "",
      postal_code:    user.profile.postal_code    ?? "",
      country:        user.profile.country        ?? "",
      timezone:       user.profile.timezone       ?? "UTC",
    });
  }, [user, reset]);

  // ── Submit ────────────────────────────────────────────────────────────────
  async function onSubmit(values: FormValues) {
    try {
      await updateMe({
        full_name: values.full_name,
        profile: {
          bio:            values.bio            || "",
          phone_number:   values.phone_number   || null,
          date_of_birth:  values.date_of_birth  || null,
          address_line1:  values.address_line1  || "",
          address_line2:  values.address_line2  || "",
          city:           values.city           || "",
          state_province: values.state_province || "",
          postal_code:    values.postal_code    || "",
          country:        values.country        || "",
          timezone:       values.timezone       || "UTC",
        },
      });

      // Refresh AuthContext so Header avatar + name update
      await reloadUser();
      toast.success(t("savedSuccess"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <SectionCard
      icon={User}
      title={t("sectionPersonal")}
      description={t("sectionPersonalDesc")}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

        {/* ── Basic info ──────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-4">
          <FormRow
            id="full_name"
            label={t("fieldFullName")}
            error={errors.full_name?.message}
            required
          >
            <Input
              id="full_name"
              placeholder="Jane Smith"
              autoComplete="name"
              {...register("full_name")}
            />
          </FormRow>

          <FormRow id="phone_number" label={t("fieldPhone")} error={errors.phone_number?.message}>
            <div className="relative">
              <Phone className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="phone_number"
                placeholder="+1 555 000 0000"
                autoComplete="tel"
                className="ps-9"
                {...register("phone_number")}
              />
            </div>
          </FormRow>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormRow id="date_of_birth" label={t("fieldDob")} error={errors.date_of_birth?.message}>
            <div className="relative">
              <Calendar className="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="date_of_birth"
                type="date"
                className="ps-9"
                {...register("date_of_birth")}
              />
            </div>
          </FormRow>

          <FormRow id="timezone" label={t("fieldTimezone")} error={errors.timezone?.message}>
            <Select
              value={watch("timezone")}
              onValueChange={(v) => setValue("timezone", v, { shouldDirty: true })}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="UTC" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormRow>
        </div>

        {/* Bio */}
        <FormRow id="bio" label={t("fieldBio")} error={errors.bio?.message}>
          <div className="relative">
            <FileText className="absolute inset-s-3 top-3 size-4 text-muted-foreground pointer-events-none" />
            <Textarea
              id="bio"
              placeholder={t("fieldBioPlaceholder")}
              rows={3}
              className="ps-9 resize-none"
              {...register("bio")}
            />
          </div>
          <p className="text-[11px] text-muted-foreground text-end">
            {watch("bio")?.length ?? 0}/300
          </p>
        </FormRow>

        {/* ── Address ─────────────────────────────────────────────────── */}
        <div className="pt-2 border-t border-border/40 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            <p className="text-[13px] font-semibold text-foreground">
              {t("sectionAddress")}
            </p>
          </div>

          <FormRow id="address_line1" label={t("fieldAddress1")} error={errors.address_line1?.message}>
            <Input id="address_line1" placeholder="123 Main Street" autoComplete="address-line1" {...register("address_line1")} />
          </FormRow>

          <FormRow id="address_line2" label={t("fieldAddress2")} error={errors.address_line2?.message}>
            <Input id="address_line2" placeholder="Suite 400" autoComplete="address-line2" {...register("address_line2")} />
          </FormRow>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormRow id="city" label={t("fieldCity")} error={errors.city?.message}>
              <Input id="city" placeholder="New York" autoComplete="address-level2" {...register("city")} />
            </FormRow>

            <FormRow id="state_province" label={t("fieldState")} error={errors.state_province?.message}>
              <Input id="state_province" placeholder="NY" autoComplete="address-level1" {...register("state_province")} />
            </FormRow>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormRow id="postal_code" label={t("fieldPostal")} error={errors.postal_code?.message}>
              <Input id="postal_code" placeholder="10001" autoComplete="postal-code" {...register("postal_code")} />
            </FormRow>

            <FormRow id="country" label={t("fieldCountry")} error={errors.country?.message}>
              <Select
                value={watch("country")}
                onValueChange={(v) => setValue("country", v, { shouldDirty: true })}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder={t("fieldCountryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="rounded-full bg-color shadow-brand
                       hover:-translate-y-0.5 transition-transform duration-200
                       gap-2 font-semibold min-w-32"
          >
            {isSubmitting ? (
              <><Loader2 className="size-4 animate-spin" />{t("saving")}</>
            ) : (
              <><Save className="size-4" />{t("saveChanges")}</>
            )}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
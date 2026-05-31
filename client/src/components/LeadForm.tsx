import { FormEvent, useMemo, useState } from "react";
import { Send } from "lucide-react";
import type { ServiceType } from "../types/lead";
import { useLocale } from "../i18n/locale";
import { getTranslations } from "../i18n/translations";
import { CtaButton } from "./CtaButton";
import { FileUploadField } from "./FileUploadField";
import { SuccessMessage } from "./SuccessMessage";

const maxPhotos = 6;
const maxFileSize = 10 * 1024 * 1024;
const maxCommentLength = 500;
type FieldErrors = Partial<Record<"serviceType" | "location" | "phone" | "comment" | "photos" | "form", string>>;

export function LeadForm() {
  const t = getTranslations(useLocale());
  const copy = t.form;
  const serviceOptions = t.services;
  const [serviceType, setServiceType] = useState<ServiceType>("sofa");
  const [location, setLocation] = useState(""); const [phone, setPhone] = useState(""); const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]); const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false); const [isComplete, setIsComplete] = useState(false);
  const selectedService = useMemo(() => serviceOptions.find((service) => service.value === serviceType), [serviceOptions, serviceType]);

  function hasValidPhoneFormat(value: string) { const digits = value.replace(/\D/g, ""); return /^\+?[\d\s().-]+$/.test(value) && digits.length >= 10 && digits.length <= 15; }
  function updatePhotos(nextFiles: File[]) {
    const nextErrors = { ...errors }; delete nextErrors.photos;
    if (nextFiles.length > maxPhotos) nextErrors.photos = copy.errors.maxPhotos;
    if (nextFiles.some((file) => !file.type.startsWith("image/"))) nextErrors.photos = copy.errors.imagesOnly;
    if (nextFiles.some((file) => file.size > maxFileSize)) nextErrors.photos = copy.errors.maxFileSize;
    setPhotos(nextFiles.slice(0, maxPhotos)); setErrors(nextErrors);
  }
  function validate() {
    const nextErrors: FieldErrors = {}; const trimmedLocation = location.trim(); const trimmedPhone = phone.trim();
    if (!serviceType) nextErrors.serviceType = copy.errors.service;
    if (!trimmedLocation) nextErrors.location = copy.errors.location; else if (trimmedLocation.length < 2) nextErrors.location = copy.errors.locationShort;
    if (!trimmedPhone) nextErrors.phone = copy.errors.phone; else if (!hasValidPhoneFormat(trimmedPhone)) nextErrors.phone = copy.errors.phoneInvalid;
    if (photos.length === 0) nextErrors.photos = copy.errors.photos;
    if (photos.some((file) => !file.type.startsWith("image/"))) nextErrors.photos = copy.errors.imagesOnly;
    if (photos.some((file) => file.size > maxFileSize)) nextErrors.photos = copy.errors.maxFileSize;
    if (comment.trim().length > maxCommentLength) nextErrors.comment = copy.errors.comment;
    setErrors(nextErrors); return Object.keys(nextErrors).length === 0;
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setIsComplete(false); if (!validate()) return;
    setIsSubmitting(true);
    try { await new Promise<void>((resolve) => window.setTimeout(resolve, 250)); setIsComplete(true); setLocation(""); setPhone(""); setComment(""); setPhotos([]); setErrors({}); }
    finally { setIsSubmitting(false); }
  }
  return <section className="section-shell pb-12" id="lead-form"><div className="grid overflow-hidden rounded-[16px] border border-ink/10 bg-white lg:grid-cols-[0.76fr_1.24fr] lg:rounded-[18px]"><div className="bg-pine p-4 text-white sm:p-7"><p className="text-sm font-bold text-gold">{copy.eyebrow}</p><h2 className="mt-3 text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-3xl">{copy.title}</h2><p className="mt-4 text-sm leading-6 text-white/72">{copy.intro}</p>{selectedService && <div className="mt-6 rounded-[14px] border border-white/12 bg-white/8 p-4 text-sm text-white/78">{copy.selected} <span className="font-bold text-white">{selectedService.label}</span>{" "}<span className="font-bold text-gold">{selectedService.price}</span></div>}</div>
  <div className="p-4 sm:p-6 lg:p-7"><form className="grid gap-4 sm:gap-5 lg:grid-cols-2" onSubmit={handleSubmit}><div><label className="mb-2 block text-sm font-bold text-pine">{copy.service}</label><div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:grid-cols-3">{serviceOptions.map((service) => <button className={`min-h-[68px] rounded-[14px] border px-3 py-3 text-left text-sm transition sm:min-h-[74px] ${serviceType === service.value ? "border-teal bg-mint text-pine" : "border-ink/10 bg-white text-ink/75 hover:border-teal/45"}`} key={service.value} type="button" aria-pressed={serviceType === service.value} onClick={() => setServiceType(service.value)}><span className="block font-semibold">{service.label}</span><span className="mt-1 block text-xs leading-5">{service.price}</span></button>)}</div>{errors.serviceType && <p className="mt-2 text-sm font-semibold text-red-600">{errors.serviceType}</p>}</div>
  <FileUploadField files={photos} error={errors.photos} onChange={updatePhotos} /><div><label className="mb-2 block text-sm font-bold text-pine" htmlFor="location">{copy.location}</label><input className="field" id="location" placeholder={copy.locationPlaceholder} value={location} aria-invalid={Boolean(errors.location)} onChange={(event) => { setLocation(event.target.value); setErrors(({ location: _, ...rest }) => rest); }} />{errors.location && <p className="mt-2 text-sm font-semibold text-red-600">{errors.location}</p>}</div>
  <div><label className="mb-2 block text-sm font-bold text-pine" htmlFor="phone">{copy.phone}</label><input className="field" id="phone" inputMode="tel" autoComplete="tel" placeholder="+380..." value={phone} aria-invalid={Boolean(errors.phone)} onChange={(event) => { setPhone(event.target.value); setErrors(({ phone: _, ...rest }) => rest); }} />{errors.phone && <p className="mt-2 text-sm font-semibold text-red-600">{errors.phone}</p>}</div>
  <div className="lg:col-span-2"><label className="mb-2 block text-sm font-bold text-pine" htmlFor="comment">{copy.comment} <span className="font-normal text-ink/50">{copy.optional}</span></label><textarea className="field min-h-24 resize-y sm:min-h-28" id="comment" maxLength={maxCommentLength + 1} placeholder={copy.commentPlaceholder} value={comment} aria-invalid={Boolean(errors.comment)} onChange={(event) => { setComment(event.target.value); setErrors(({ comment: _, ...rest }) => rest); }} /><div className="mt-2 flex items-center justify-between gap-3">{errors.comment ? <p className="text-sm font-semibold text-red-600">{errors.comment}</p> : <span className="text-xs text-ink/50">{copy.maxChars}</span>}<span className="text-xs text-ink/50">{comment.trim().length}/{maxCommentLength}</span></div></div>
  {errors.form && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 lg:col-span-2">{errors.form}</p>}<div className="flex flex-col gap-3 lg:col-span-2 sm:flex-row sm:items-center"><CtaButton className="min-h-12 w-full sm:w-auto" disabled={isSubmitting} type="submit"><Send size={18} />{isSubmitting ? copy.sending : copy.submit}</CtaButton><p className="text-xs leading-5 text-ink/60 sm:text-sm">{copy.privacy}</p></div></form></div></div>{isComplete && <SuccessMessage onClose={() => setIsComplete(false)} />}</section>;
}

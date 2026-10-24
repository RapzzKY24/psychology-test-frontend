/**
 * Public WhatsApp deep link (used by the B2B page CTA). The number comes from
 * the validated runtime env (`NEXT_PUBLIC_WA_NUMBER`, digits only).
 */
export function buildWhatsAppLink(number: string, text: string): string {
  const digits = number.replace(/\D/g, "");
  if (!digits) return `https://wa.me/?text=${encodeURIComponent(text)}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

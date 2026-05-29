export function whatsappUrl(number: string | undefined): string | undefined {
  if (!number?.trim()) return undefined;
  const digits = number.replace(/\D/g, "");
  if (!digits) return undefined;
  return `https://wa.me/${digits}`;
}

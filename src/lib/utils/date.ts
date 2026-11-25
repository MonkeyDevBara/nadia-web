/** "2026-11-25" -> "25 Nov 2026". Tanggal murni (tanpa zona waktu), jadi diformat sebagai UTC agar tidak bergeser. */
export function formatArticleDate(date: string, locale = "en-GB"): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

import { db, type Lang } from "../db.js";
import { t } from "../messages.js";

interface Row { reference: string; applicant_name: string; scholarship: string; status: string; details_en: string; details_ta: string }

export function lookupApplication(reference: string, lang: Lang): { found: false } | { found: true; message: string; record: Record<string, string> } {
  const r = db.prepare("SELECT * FROM demo_applications WHERE reference = ?").get(reference) as Row | undefined;
  if (!r) return { found: false };
  return {
    found: true,
    record: { reference: r.reference, name: r.applicant_name, scholarship: r.scholarship, status: r.status },
    message: t(lang, "statusResult", {
      name: r.applicant_name,
      scholarship: r.scholarship,
      status: r.status,
      details: lang === "ta" ? r.details_ta : r.details_en,
    }),
  };
}

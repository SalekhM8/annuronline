import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

const GREEN = rgb(10 / 255, 61 / 255, 46 / 255);
const GOLD = rgb(212 / 255, 175 / 255, 55 / 255);
const CREAM = rgb(250 / 255, 247 / 255, 240 / 255);
const INK = rgb(28 / 255, 43 / 255, 38 / 255);

/** Branded A4-landscape module-completion certificate. */
export async function renderCertificatePdf(cert: {
  serial: string;
  studentName: string;
  moduleTitle: string;
  courseTitle: string;
  issuedAt: Date;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);

  page.drawRectangle({ x: 0, y: 0, width, height, color: CREAM });
  // double border: outer gold, inner green
  page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderColor: GOLD, borderWidth: 3 });
  page.drawRectangle({ x: 36, y: 36, width: width - 72, height: height - 72, borderColor: GREEN, borderWidth: 1.2 });

  const centre = (text: string, y: number, font = serif, size = 16, color = INK) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - w) / 2, y, size, font, color });
  };

  // corner marks (gold diamonds drawn as rotated squares)
  for (const [cx, cy] of [[68, height - 68], [width - 68, height - 68], [68, 68], [width - 68, 68]] as const) {
    page.drawSquare({ x: cx, y: cy - 8.5, size: 12, color: GOLD, rotate: degrees(45) });
  }

  centre("AN-NUR ACADEMY", height - 110, serifBold, 30, GREEN);
  centre("UK-based Online Islamic Academy", height - 132, serifItalic, 12, GOLD);

  centre("Certificate of Completion", height - 195, serif, 34, INK);

  centre("This is to certify that", height - 245, serifItalic, 14, INK);
  centre(cert.studentName, height - 290, serifBold, 32, GREEN);

  centre("has successfully completed the module", height - 330, serifItalic, 14, INK);
  centre(cert.moduleTitle, height - 365, serifBold, 22, INK);
  centre(`${cert.courseTitle} Programme`, height - 390, serif, 14, INK);

  const dateStr = cert.issuedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  centre(dateStr, 120, serif, 13, INK);
  centre("Mufti Ateiq-ur Rehman — Principal", 96, serifItalic, 12, INK);

  page.drawText(`Serial: ${cert.serial}`, { x: 48, y: 44, size: 8, font: serif, color: INK });
  page.drawText("Verify at annur.online", { x: width - 150, y: 44, size: 8, font: serif, color: INK });

  return doc.save();
}

export function nextSerial(count: number, year = new Date().getFullYear()): string {
  return `ANA-${year}-${String(count + 1).padStart(5, "0")}`;
}

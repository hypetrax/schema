import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BV Hardenberg - Badminton Wedstrijdschema & Aanwezigheid",
  description: "Wedstrijdschema en spelersaanwezigheid voor BV Hardenberg. Geef door of je speelt (Bart, Emile, Age, Harry, Ronald).",
  keywords: ["BV Hardenberg", "badminton", "schema", "wedstrijdschema", "aanwezigheid"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}

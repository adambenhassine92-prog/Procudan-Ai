import "./globals.css";

export const metadata = {
  title: "Procudan AI — Produktionsassistent",
  description: "Intelligent produktionsassistent for pulverproduktion: blanding, dosering, pakning og kvalitetskontrol.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "Firestarter SEO — Proposals",
  description: "Internal proposal builder for Firestarter SEO.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Used only by the proposal document (components/proposal/*) — Fjalla
            One / Roboto Slab / Overpass are the fonts from the original
            hand-coded proposal template. Loaded app-wide for simplicity since
            this is a low-traffic internal tool, not a marketing site. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fjalla+One&family=Roboto+Slab:wght@400;700&family=Overpass:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

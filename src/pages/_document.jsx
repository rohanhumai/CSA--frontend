import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Sora:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-slate-100 text-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

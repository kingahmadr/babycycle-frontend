import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      {/* Import Gabarito font */}
      <link
          href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

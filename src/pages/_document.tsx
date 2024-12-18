import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      {/* Gabarito font */}
      <link
        href='https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;700&display=swap'
        rel='stylesheet'
      />
      {/* Font Awesome CDN */}
      <link
        rel='stylesheet'
        href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
      />
      <body className='w-full'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

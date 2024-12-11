import '../styles/globals.css' // Ensure your styles are imported
import type { AppProps } from 'next/app'
import Layout from '@/layouts'
import { CartProvider } from "@/context/CartContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <CartProvider>
      <Component {...pageProps} />
      </CartProvider>
    </Layout>
  )
}

export default MyApp


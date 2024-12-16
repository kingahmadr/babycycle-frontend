import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/layouts';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
};

export default MyApp;

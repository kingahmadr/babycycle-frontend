import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/layouts'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getPageRouteTitle } from '@/utils/getPageRouteTitle'
import AuthGuard from '@/components/AuthGuard'
import { PROTECTED_ROUTES } from '@/constants/pages'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  const dynamicTitle = getPageRouteTitle('Baby Cycle', router.pathname)

  const isProtected = PROTECTED_ROUTES.includes(router.pathname)

  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Head>
            <title>{dynamicTitle}</title>
          </Head>
          {isProtected ? (
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </CartProvider>
    </AuthProvider>
  )
}

export default MyApp

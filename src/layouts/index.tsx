import Navbar from '@/components/Navbar'
import MainLayout from './MainLayout'
import Footer from '@/components/Footer'
import { useRouter } from 'next/router'
import { PUBLIC_ROUTES } from '@/constants/page'
import PublicLayout from './PublicLayout'

export interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()

  const isPublicRoute = () => {
    return PUBLIC_ROUTES.some((route) => router.pathname.startsWith(route))
  }
  // const isLandingPage = router.pathname.startsWith(PAGE_LANDING)

  return (
    <>
      <Navbar />
      {isPublicRoute() ? (
        <PublicLayout>{children}</PublicLayout>
      ) : (
        <MainLayout>{children}</MainLayout>
      )}
      <Footer />
    </>
  )
}

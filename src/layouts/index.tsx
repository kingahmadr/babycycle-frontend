import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useRouter } from 'next/router'
import { PUBLIC_ROUTES } from '@/constants/pages'

export interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()

  const isPublicRoute = () => {
    return PUBLIC_ROUTES.some((route: string) => router.pathname.startsWith(route))
  }
  // const isLandingPage = router.pathname.startsWith(PAGE_LANDING)

  return (
    <>
      <Navbar />
      <main
        className={`${
          isPublicRoute() ? 'w-full' : 'max-w-[1440px]'
        } flex flex-col gap-8 row-start-2 items-center sm:items-start`}
        style={{ marginTop: `239px` }}
      >
        {children}
      </main>
      <Footer />
    </>
  )
}

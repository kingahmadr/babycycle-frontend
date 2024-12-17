import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import LoadingSpinner from '@/components/LoadingSpinner'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  return loading || !isAuthenticated ? (
    <div className='w-full h-[calc(100vh-479px)] bg-white flex items-center justify-center'>
      <LoadingSpinner className='w-16 h-16 mx-auto' />
    </div>
  ) : (
    <>{children}</>
  )
}

export default AuthGuard

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode
} from 'react'
import { useRouter } from 'next/router'
import { API_LOGIN, API_ME } from '@/constants/apis'
import { UserData} from '@/models/User'

interface AuthContextType {
  user: UserData | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  // Fetch the authenticated user's profile
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(API_ME, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      alert(error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchUserProfile()
  }, [])

  // const fetchUserProfile = async () => {
  //   try {
  //     const response = await fetch(API_ME, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('token')}`
  //       }
  //     })
  //     if (response.ok) {
  //       const userData = await response.json()
  //       setUser(userData)
  //     } else {
  //       setUser(null)
  //     }
  //   } catch (error) {
  //     alert(error)
  //     setUser(null)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(API_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Invalid login credentials')
      }

      const { access_token } = await response.json()
      localStorage.setItem('token', access_token)

      try {
        await fetchUserProfile()
        router.push('/dashboard')
      } catch (profileError) {
        console.error('Failed to fetch user profile:', profileError)
        router.push('/')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    router.push('/')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook for consuming AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

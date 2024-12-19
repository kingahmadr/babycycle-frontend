import { useState } from 'react'
import { validateEmail, validatePassword } from '@/utils/validation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email and password
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email.')
      return
    }
    if (!validatePassword(form.password)) {
      setError(
        'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.'
      )
      return
    }

    setError(null)
    setLoading(true)

    try {
      // Call the login method from AuthContext
      await login(form.email, form.password)
    } catch (error) {
      setError(`An error occurred during login : ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-[calc(100vh-120px)] bg-babyBlue flex items-center justify-center relative -z-10'>
      <img className='top-0 left-40 absolute z-[5]' src='/asset1_1_inv.png'/>
      <img className='bottom-0 right-0 absolute z-[5] rotate-180' src='/asset1_1_inv.png'/>
      <img className='top-0 right-0 absolute -z-[1]' src='/asset3_1.png'/>
      <img
            className='absolute top-[167px] left-[146px] z-[3]'
            src='/image_3.png'
          />
      <img
            className='absolute top-[125px] left-[104px] z-[1]'
            src='/Rectangle_42.png'
          />
      <img className='bottom-0 left-0 absolute z-[5] rotate-180' src='/asset3_1.png'/>
      <img className='bottom-0 left-[768px] absolute -z-10' src='/asset2_1_inv.png'/>
      <img className='bottom-0 left-20 absolute -z-10' src='/asset2_1_inv2.png'/>


      <div className='w-0 lg:w-1/2'></div>
      <div className='p-6 rounded w-full lg:w-1/2 max-w-md'>
        <>
          <h1 className='text-4xl font-medium text-textBlue mb-4'>LOGIN</h1>
          <form onSubmit={handleSubmit}>
            <input
              type='email'
              placeholder='Email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className='w-full p-3 border mb-4 focus:ring-2 focus:ring-buttonBlue focus:outline-none'
            />
            <input
              type='password'
              placeholder='Password'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className='w-full p-3 border mb-4 focus:ring-2 focus:ring-buttonBlue focus:outline-none'
            />
            <button
              type='submit'
              className='w-full bg-buttonBlue hover:bg-textBlue text-white py-2 rounded transition-all duration-300'
              disabled={loading}
            >
              {loading ? 'Loading...' : 'LOGIN'}
            </button>
          </form>
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
          <p className='italic text-sm mt-4'>
            Don&apos;t have an account?{' '}
            <Link href='/register' className='text-buttonBlue'>
              Register here!
            </Link>
          </p>
        </>
      </div>
    </div>
  )
}
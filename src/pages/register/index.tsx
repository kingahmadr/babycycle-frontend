import { useState } from 'react'
import { UserRegisterModel } from '@/models/User'
import {
  validateEmail,
  validatePassword,
  validateUsername
} from '@/utils/validation'
import { API_REGISTER } from '@/constants/apis'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState<UserRegisterModel>({
    email: '',
    username: '',
    password: ''
  })

  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(form.email)) {
      setError('Please enter a valid email.')
      return
    }
    if (!validateUsername(form.username)) {
      setError(
        'Username must be 3-20 characters and contain only letters, numbers, and underscores.'
      )
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
      const response = await fetch(API_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        const responseJson = await response.json()
        throw new Error(responseJson.error)
      }

      setMessage('User registered successfully!')
      router.push('/verification?email=' + form.email)
    } catch (error) {
      setMessage(`An error occurred : ${error}`)
    }

    setLoading(false)
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
          <h1 className='text-4xl font-medium text-textBlue mb-4'>REGISTER</h1>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Username'
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className='w-full p-3 border mb-4 focus:ring-2 focus:ring-buttonBlue focus:outline-none'
            />
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
              {loading ? 'Loading...' : 'NEXT'}
            </button>
          </form>
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
          {message && <p className='text-center mt-4 text-sm text-red-500'>{message}</p>}
          <p className='italic text-sm mt-4'>
            Already registered?{' '}
            <Link href='/login' className='text-buttonBlue'>
              Login here!
            </Link>
          </p>
        </>
      </div>
    </div>
  )
}

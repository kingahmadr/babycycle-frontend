import { API_RESEND, API_VERIFY } from '@/constants/apis'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function EmailVerification() {
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get('email') || ''

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    email: emailFromQuery,
    verification_code: ''
  })
  const [isSuccess, setIsSuccess] = useState(false)

  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Effect to set step 2 if email exists in the query params
  useEffect(() => {
    if (emailFromQuery) {
      setStep(2)
      setForm((prevForm) => ({ ...prevForm, email: emailFromQuery }))
    }
  }, [emailFromQuery])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      let response

      if (step === 1) {
        // Send OTP request
        response = await fetch(API_RESEND, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: form.email })
        })

        if (!response.ok) {
          const responseJson = await response.json()
          throw new Error(responseJson.error)
        }

        setMessage('OTP sent to your email. Please check your inbox.')
        setStep(2) // Move to OTP input step
      } else {
        // OTP verification step
        response = await fetch(API_VERIFY, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: form.email,
            verification_code: form.verification_code
          })
        })

        if (!response.ok) {
          const responseJson = await response.json()
          throw new Error(responseJson.message)
        }

        setMessage('Email verified successfully! You can now log in.')
        setIsSuccess(true)
      }
    } catch (error) {
      setMessage(`An error occurred: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-[calc(100vh-479px)] bg-gray-100 flex items-center justify-center'>
      <div className='w-0 lg:w-1/2'></div>
      <div className='p-6 rounded w-full lg:w-1/2 max-w-md'>
        {isSuccess ? (
          <>
            <h1 className='text-4xl font-medium text-green-600 mb-4 tracking-widest'>
              SUCCESS!
            </h1>
            <p className='text-sm font-medium text-gray-700 mb-4 tracking-widest'>
              Your email has been successfully verified. You can now log in to
              your account.
            </p>
            <button
              onClick={() => (window.location.href = '/login')}
              className='w-full bg-buttonBlue hover:bg-textBlue text-white py-2 rounded transition-all duration-300'
            >
              Go to Login
            </button>
          </>
        ) : step === 1 ? (
          <>
            <h1 className='text-4xl font-medium text-textBlue mb-4 tracking-widest'>
              VERIFY <br /> YOUR EMAIL
            </h1>
            <p className='text-sm font-medium text-textBlue mb-4 tracking-widest'>
              An OTP will be sent to your email and will expire in 15 minutes.
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={form.email}
                onChange={handleChange}
                required
                className='w-full p-3 border mb-4 focus:ring-2 focus:ring-buttonBlue focus:outline-none'
              />
              <button
                type='submit'
                className='w-full bg-buttonBlue hover:bg-textBlue text-white py-2 rounded transition-all duration-300'
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Send OTP'}
              </button>
            </form>
            {message && (
              <p className='text-center mt-4 text-sm text-red-500'>{message}</p>
            )}
          </>
        ) : (
          <>
            <h1 className='text-4xl font-medium text-textBlue mb-4 tracking-widest'>
              INSERT <br /> YOUR OTP
            </h1>
            <p className='text-sm font-medium text-textBlue mb-4 tracking-widest'>
              Please enter the OTP sent to your email.
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                name='verification_code'
                placeholder='Enter OTP'
                value={form.verification_code}
                onChange={handleChange}
                required
                className='w-full p-3 border mb-4 focus:ring-2 focus:ring-buttonBlue focus:outline-none'
              />
              <button
                type='submit'
                className='w-full bg-buttonBlue hover:bg-textBlue text-white py-2 rounded transition-all duration-300'
                disabled={loading}
              >
                {loading ? 'Loading...' : 'VERIFY'}
              </button>
              <button
                type='button'
                onClick={() => setStep(1)}
                className='w-full mt-2 bg-gray-400 text-white py-2 rounded transition-all duration-300'
                disabled={loading}
              >
                Resend OTP
              </button>
            </form>
            {message && (
              <p className='text-center mt-4 text-sm text-red-500'>{message}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

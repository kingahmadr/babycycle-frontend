import { API_FORGOT_PASSWORD } from '@/constants/apis';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ForgotPassword() {
    const searchParams = useSearchParams()
    const emailFromQuery = searchParams.get('email') || ''
    // const [getURL, setGetURL] = useState<string | null>(null)
  
    const [form, setForm] = useState({
      email: emailFromQuery
    })
    const [isSuccess, setIsSuccess] = useState(false)
  
    const [message, setMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
  
    // Effect to set step 2 if email exists in the query params
    useEffect(() => {
      if (emailFromQuery) {
        // getResetURL()
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
        const response = await fetch(API_FORGOT_PASSWORD, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: form.email }),
        });
      
        if (!response.ok) {
          const responseJson = await response.json();
          throw new Error(responseJson.error);
        }
      
        setMessage('Reset password link sent to your email.');
        setIsSuccess(true);
      } catch (error) {
        setMessage(`An error occurred: ${error}`);
      } finally {
        setLoading(false);
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
                Please check your email for the reset URL.
              </p>
              <button
                onClick={() => (window.location.href = '/login')}
                className='w-full bg-buttonBlue hover:bg-textBlue text-white py-2 rounded transition-all duration-300'
              >
                Go to Login
              </button>
            </>
          ) : (
            <>
              <h1 className='text-4xl font-medium text-textBlue mb-4 tracking-widest'>
                INPUT <br /> YOUR EMAIL
              </h1>
              <p className='text-sm font-medium text-textBlue mb-4 tracking-widest'>
                A reset link will be sent to your email.
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
                  {loading ? 'Loading...' : 'Send Reset Link'}
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


import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { API_RESET_PASSWORD } from '@/constants/apis';
import { validatePassword, validateConfirmPassword } from '@/utils/validation';


// interface ResetPasswordPageProps {
//     token: string
// }


const ResetPasswordPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const token = Array.isArray(slug) ? slug[0] : slug;

  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    new_password: '',
    confirm_password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password and confirmation
    if (!validatePassword(form.new_password)) {
      setError(
        'Password must be at least 8 characters long, include an uppercase letter, and a number.'
      );
      return;
    }

    if (!validateConfirmPassword(form.new_password, form.confirm_password)) {
      setError('Passwords do not match.');
      return;
    }

    setError(null); // Clear any previous validation errors
    setLoading(true);

    try {
      if (!token) {
        throw new Error('Token is missing. Please use the correct link.');
      }

      const response = await fetch(`${API_RESET_PASSWORD}/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, new_password: form.new_password }),
      });

      if (!response.ok) {
        const responseJson = await response.json();
        throw new Error(responseJson.error || 'Failed to reset password.');
      }

      setMessage('Password has been changed.');
      setIsSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-479px)] bg-gray-100 flex items-center justify-center">
      <div className="w-0 lg:w-1/2"></div>
      <div className="p-6 rounded w-full lg:w-1/2 max-w-md">
        {isSuccess ? (
          <>
            <h1 className="text-4xl font-medium text-green-600 mb-4 tracking-widest">
              SUCCESS!
            </h1>
            <p className="text-sm font-medium text-gray-700 mb-4 tracking-widest">
              Your password has been reset.
            </p>
            <button
              onClick={() => (window.location.href = '/login')}
              className="w-full bg-buttonBlue hover:bg-textBlue text-white py-2 rounded transition-all duration-300"
            >
              Go to Login
            </button>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-medium text-textBlue mb-4 tracking-widest">
              INPUT <br /> YOUR NEW PASSWORD
            </h1>
            <p className="text-sm font-medium text-textBlue mb-4 tracking-widest">
              Change your password here.
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                name="new_password"
                placeholder="New Password"
                value={form.new_password}
                onChange={handleChange}
                required
                className="w-full p-3 border mb-4 focus:ring-2 focus:ring-buttonBlue focus:outline-none"
              />
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={form.confirm_password}
                onChange={handleChange}
                required
                className="w-full p-3 border mb-4 focus:ring-2 focus:ring-buttonBlue focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-buttonBlue hover:bg-textBlue text-white py-2 rounded transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Change Password'}
              </button>
            </form>
            {error && (
              <p className="text-center mt-4 text-sm text-red-500">{error}</p>
            )}
            {message && !error && (
              <p className="text-center mt-4 text-sm text-green-500">
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
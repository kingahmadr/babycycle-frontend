import { useState } from 'react';
import axios from 'axios';

export default function RegisterAndVerify() {
  const [step, setStep] = useState(1); // Step 1: Registration, Step 2: OTP Verification
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://api.babycycle.my.id/api/v1/users/register', form);
      setMessage(response.data.message || 'User registered successfully!');
      setStep(2); // Move to OTP verification step
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://api.babycycle.my.id/api/v1/users/verify', {
        email: form.email,
        otp,
      });
      setMessage('Your email has been verified!');
      // Navigate to a success page or dashboard
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await axios.post('https://api.babycycle.my.id/api/v1/users/resend-otp', { email: form.email });
      setMessage('A new OTP has been sent to your email!');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {step === 1 ? (
          <>
            <h1 className="text-xl font-semibold mb-4">Register</h1>
            <form onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full p-3 border rounded mb-4"
              />
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="w-full p-3 border rounded mb-4"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full p-3 border rounded mb-4"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Register'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-4">Verify Your Email</h1>
            <p className="text-sm text-gray-600 mb-6">
              Enter the OTP sent to your email: <strong>{form.email}</strong>
            </p>
            <form onSubmit={handleVerifyOTP}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-3 border rounded mb-4"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
            <button
              type="button"
              onClick={handleResendOTP}
              className="w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Resending...' : 'Resend OTP'}
            </button>
          </>
        )}
        {message && <p className="text-center mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}

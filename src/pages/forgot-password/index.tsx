import { useState, FormEvent } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>(''); // Email state with type
  const [message, setMessage] = useState<string>(''); // Message state with type
  const [loading, setLoading] = useState<boolean>(false); // Loading state with type
  const [error, setError] = useState<Error | null>(null); // Error state with type

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate email
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.babycycle.my.id/api/v1/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const data = await response.json();
        setMessage(data.message || 'Reset email sent successfully!');
      } else {
        setMessage('Password reset request sent, please check your email.');
      }
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(err); // Store the error in state
      setMessage(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email address to receive a password reset link.
        </p>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
        {message && <p className="text-center mt-4 text-sm text-gray-600">{message}</p>}
        {error && <p className="text-center mt-4 text-sm text-red-600">Error: {error.message}</p>}
      </div>
    </div>
  );
}

import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://api.babycycle.my.id/api/v1/users/login', form); // Flask endpoint
      setMessage(response.data.message);
      // Optionally, save user data or token in localStorage
      localStorage.setItem('username', response.data.username);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-pink-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <p className="text-center mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}

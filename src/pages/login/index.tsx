import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Log In</h1>
        <form className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md"
          />
          <button className="w-full py-3 bg-blue-500 text-white rounded-md">
            Next
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account? <a href="/register" className="text-blue-500">Register</a>
        </p>
      </div>
    </>
   
  );
}

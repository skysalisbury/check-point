import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as authService from '../../services/authService';

export default function LogInPage({ setUser }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  /* ---------- handlers ---------- */
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = await authService.logIn(formData);
      setUser(user);
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMsg('Log In Failed – Try Again');
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  }

  /* ---------- ui ---------- */
  return (
    <section className="min-h-screen bg-neutral-900 flex items-center">
      <div className="mx-auto w-full max-w-md px-6">
        {/* card */}
        <div className="rounded-lg bg-neutral-800 p-8 shadow-lg shadow-black/30">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-100">
            Sign in to <span className="text-emerald-400">Check-Point</span>
          </h2>

          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="
                  w-full rounded-md border border-neutral-700 bg-neutral-700
                  p-3 text-gray-100 placeholder-gray-400
                  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50
                "
              />
            </div>

            {/* password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="
                  w-full rounded-md border border-neutral-700 bg-neutral-700
                  p-3 text-gray-100 placeholder-gray-400
                  focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50
                "
              />
            </div>

            {/* submit */}
            <button
              type="submit"
              className="
                w-full rounded-md bg-emerald-600 py-3 font-medium text-white
                transition hover:bg-emerald-500
              "
            >
              Log In
            </button>

            {/* error message */}
            {errorMsg && (
              <p className="text-center text-sm text-red-500">{errorMsg}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
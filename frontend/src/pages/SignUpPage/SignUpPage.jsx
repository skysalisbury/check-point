import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router'; 
import { signUp } from '../../services/authService';

export default function SignUpPage({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const navigate   = useNavigate();
  const location   = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  const disable = formData.password !== formData.confirm;

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = await signUp(formData);
      setUser(user);        
      navigate(redirectTo);   
    } catch {
      setErrorMsg('Sign Up Failed – Try Again');
    }
  }

  return (
    <section className="min-h-screen bg-neutral-900 flex items-center">
      <div className="mx-auto w-full max-w-md px-6">
        <div className="rounded-lg bg-neutral-800 p-8 shadow-lg shadow-black/30">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-100">
            Create your <span className="text-emerald-400">Check-Point</span> account
          </h2>

          <form autoComplete="off" onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-700 bg-neutral-700 p-3
                           text-gray-100 placeholder-gray-400 focus:border-emerald-500
                           focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-700 bg-neutral-700 p-3
                           text-gray-100 placeholder-gray-400 focus:border-emerald-500
                           focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-700 bg-neutral-700 p-3
                           text-gray-100 placeholder-gray-400 focus:border-emerald-500
                           focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                value={formData.confirm}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-700 bg-neutral-700 p-3
                           text-gray-100 placeholder-gray-400 focus:border-emerald-500
                           focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={disable}
              className={`w-full rounded-md py-3 font-medium transition ${
                disable
                  ? 'cursor-not-allowed bg-emerald-600/50 text-white/50'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              Sign Up
            </button>

            {errorMsg && (
              <p className="text-center text-sm text-red-500">{errorMsg}</p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-emerald-400 underline hover:text-emerald-300"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

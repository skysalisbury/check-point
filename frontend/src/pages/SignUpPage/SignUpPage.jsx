// src/pages/SignUpPage.jsx
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
      setUser(user);            // now logged in
      navigate(redirectTo);     // go where they originally wanted
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

          {/* form omitted here for brevity – keep exactly what you had */}

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to={`/login${location.search}`}     // also keep redirect
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

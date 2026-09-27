import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const ok = await login(data);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink">
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-ink-line bg-gradient-to-b from-ink-soft to-ink">
        <div className="text-2xl font-display font-bold tracking-tight">
          Vendr<span className="text-gold">.</span>
        </div>
        <div className="max-w-sm">
          <p className="text-3xl font-display font-semibold leading-snug">
            Log back in to see where your shop stands today.
          </p>
        </div>
        <div className="text-xs text-mist-dim">
          © {new Date().getFullYear()} Vendr Seller Console
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold mb-1">
            Log in to your console
          </h1>
          <p className="text-mist-dim text-sm mb-8">
            Manage your listings and orders.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <label className="block text-sm mb-1.5 text-mist-dim">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-ink-soft border border-ink-line rounded-card px-3.5 py-2.5 text-sm focus-ring"
                placeholder="you@shop.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1.5 text-mist-dim">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-ink-soft border border-ink-line rounded-card px-3.5 py-2.5 text-sm focus-ring"
                placeholder="Your password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-ink font-semibold rounded-card py-2.5 text-sm mt-2 hover:bg-gold-soft transition-colors disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="text-sm text-mist-dim mt-6">
            New seller?{' '}
            <Link to="/signup" className="text-gold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

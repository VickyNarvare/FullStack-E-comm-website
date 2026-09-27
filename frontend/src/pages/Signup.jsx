import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const ok = await signup({
      userName: data.name,
      shopName: data.shopName,
      email: data.email,
      password: data.password,
    });
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-ink-line bg-gradient-to-b from-ink-soft to-ink">
        <div className="text-2xl font-display font-bold tracking-tight">
          Vendr<span className="text-gold">.</span>
        </div>
        <div className="max-w-sm">
          <p className="text-3xl font-display font-semibold leading-snug">
            Every product you list here builds your seller rank.
          </p>
          <p className="text-mist-dim mt-4 text-sm">
            Track inventory, pricing, and performance from one console built for
            sellers who ship consistently.
          </p>
        </div>
        <div className="text-xs text-mist-dim">
          © {new Date().getFullYear()} Vendr Seller Console
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold mb-1">
            Create your seller account
          </h1>
          <p className="text-mist-dim text-sm mb-8">
            Start listing products in minutes.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <label className="block text-sm mb-1.5 text-mist-dim">
                Full name
              </label>
              <input
                className="w-full bg-ink-soft border border-ink-line rounded-card px-3.5 py-2.5 text-sm focus-ring"
                placeholder="Anita Sharma"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1.5 text-mist-dim">
                Shop name
              </label>
              <input
                className="w-full bg-ink-soft border border-ink-line rounded-card px-3.5 py-2.5 text-sm focus-ring"
                placeholder="Anita Handicrafts"
                {...register('shopName', { required: 'Shop name is required' })}
              />
              {errors.shopName && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.shopName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1.5 text-mist-dim">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-ink-soft border border-ink-line rounded-card px-3.5 py-2.5 text-sm focus-ring"
                placeholder="you@shop.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Enter a valid email',
                  },
                })}
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
                placeholder="Minimum 6 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1.5 text-mist-dim">
                Confirm password
              </label>
              <input
                type="password"
                className="w-full bg-ink-soft border border-ink-line rounded-card px-3.5 py-2.5 text-sm focus-ring"
                placeholder="Re-enter password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) =>
                    v === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-ink font-semibold rounded-card py-2.5 text-sm mt-2 hover:bg-gold-soft transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-mist-dim mt-6">
            Already selling with us?{' '}
            <Link to="/login" className="text-gold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

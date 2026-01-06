'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Error from '@/components/Error';
import PasswordInput from '@/components/PasswordInput';
import { useToast } from '@/components/ToastContainer';
import { useTranslations } from '@/lib/use-translations';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslations();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const registered = searchParams?.get('registered');
    if (registered === 'true') {
      showToast(t('auth', 'registrationSuccess') || 'Registration successful! Please log in.', 'success');
    }
  }, [searchParams, showToast, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Provide more specific error messages
        if (result.error.includes('Configuration')) {
          setError(t('auth', 'serverError'));
        } else if (result.error.includes('Invalid email or password')) {
          setError(t('auth', 'invalidCredentials'));
        } else {
          setError(result.error);
        }
      } else if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(t('auth', 'loginFailed'));
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || t('common', 'unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth', 'signIn')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('auth', 'dontHaveAccount')}{' '}
              <Link
                href="/auth/register"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {t('auth', 'createNewAccount')}
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && <Error message={error} />}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('auth', 'email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                  placeholder={t('auth', 'email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth', 'password')}
                required
                autoComplete="current-password"
                label={t('auth', 'password')}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {loading ? t('auth', 'signingIn') : t('auth', 'signInButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



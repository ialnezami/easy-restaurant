import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user';
import LanguageSettingsForm from '@/components/LanguageSettingsForm';

export default async function LanguageSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Language Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure the default language and available languages for your site
          </p>
        </div>

        <LanguageSettingsForm />
      </div>
    </div>
  );
}



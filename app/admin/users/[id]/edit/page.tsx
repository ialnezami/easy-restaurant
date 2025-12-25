import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/models/User';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import UserEditForm from '@/components/UserEditForm';

async function getUser(userId: string) {
  await connectDB();
  const user = await User.findById(userId).select('-password');
  return user ? JSON.parse(JSON.stringify(user)) : null;
}

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect('/dashboard');
  }

  const user = await getUser(params.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              User not found
            </h1>
            <a href="/admin" className="text-blue-600 hover:text-blue-700">
              Back to Admin
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit User</h1>
        <UserEditForm user={user} />
      </div>
    </div>
  );
}


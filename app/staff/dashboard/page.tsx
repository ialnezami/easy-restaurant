import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import OrderList from '@/components/OrderList';

export default async function StaffDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  // Check if user has access to any restaurant with workflow enabled
  await connectDB();
  const restaurants = await Restaurant.find({
    $or: [
      { owner: session.user.id },
      { managers: session.user.id },
    ],
    workflowEnabled: true,
  }).limit(1);

  if (restaurants.length === 0) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your assigned orders and update their status
          </p>
        </div>

        <OrderList staffView={true} showActions={true} />
      </div>
    </div>
  );
}


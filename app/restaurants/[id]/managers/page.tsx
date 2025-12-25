import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/models/User';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import User from '@/models/User';
import { getUserPermissions } from '@/lib/permissions';
import RestaurantManagersForm from '@/components/RestaurantManagersForm';

async function getRestaurant(id: string, userId: string, userRole: string) {
  await connectDB();
  const permissions = await getUserPermissions(userId, userRole);
  const canManage = await permissions.canManageRestaurant(id, userId);

  if (!canManage) {
    return null;
  }

  const restaurant = await Restaurant.findById(id)
    .populate('owner', 'name email')
    .populate('managers', 'name email role');

  return restaurant ? JSON.parse(JSON.stringify(restaurant)) : null;
}

async function getAllManagers() {
  await connectDB();
  const managers = await User.find({
    role: { $in: [UserRole.MANAGER, UserRole.ADMIN] },
  }).select('name email role');
  return JSON.parse(JSON.stringify(managers));
}

export default async function RestaurantManagersPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  const restaurant = await getRestaurant(
    params.id,
    session.user.id,
    session.user.role
  );

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Restaurant not found or unauthorized
            </h1>
            <a href="/dashboard" className="text-blue-600 hover:text-blue-700">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  const availableManagers = await getAllManagers();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <a
            href={`/restaurants/${params.id}`}
            className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
          >
            ← Back to Restaurant
          </a>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {restaurant.name}
          </h1>
          <p className="text-gray-600">Manage Restaurant Managers</p>
        </div>

        <RestaurantManagersForm
          restaurant={restaurant}
          availableManagers={availableManagers}
        />
      </div>
    </div>
  );
}


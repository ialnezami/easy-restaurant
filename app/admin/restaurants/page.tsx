import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import Link from 'next/link';
import WorkflowToggleButton from '@/components/WorkflowToggleButton';

async function getAllRestaurants() {
  await connectDB();
  const restaurants = await Restaurant.find({})
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(restaurants));
}

export default async function AdminRestaurantsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect('/dashboard');
  }

  const restaurants = await getAllRestaurants();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              User Management
            </Link>
            <Link
              href="/admin/languages"
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
            >
              Language Settings
            </Link>
            <Link
              href="/admin/restaurants"
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            >
              Restaurant Workflow
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Restaurant Workflow Management</h1>
            <p className="text-gray-600 mt-2">
              Enable or disable staff workflow for restaurants. When enabled, owners and managers can access the Staff Dashboard.
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workflow
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants.map((restaurant: any) => (
                <tr key={restaurant._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {restaurant.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {restaurant.owner?.name || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {restaurant.owner?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        restaurant.workflowEnabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {restaurant.workflowEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <WorkflowToggleButton
                      restaurantId={restaurant._id}
                      workflowEnabled={restaurant.workflowEnabled || false}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/restaurants/${restaurant._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


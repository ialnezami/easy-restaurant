import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import Menu from '@/models/Menu';
import Link from 'next/link';
import DeleteRestaurantButton from '@/components/DeleteRestaurantButton';

async function getRestaurant(id: string, userId: string, userRole: string) {
  await connectDB();
  const { getUserPermissions } = await import('@/lib/permissions');
  const permissions = await getUserPermissions(userId, userRole);
  const canManage = await permissions.canManageRestaurant(id, userId);

  if (!canManage) {
    return null;
  }

  const restaurant = await Restaurant.findById(id);
  return restaurant ? JSON.parse(JSON.stringify(restaurant)) : null;
}

async function getMenus(restaurantId: string) {
  await connectDB();
  const menus = await Menu.find({ restaurant: restaurantId }).sort({
    createdAt: -1,
  });
  return JSON.parse(JSON.stringify(menus));
}

export default async function RestaurantDetailPage({
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
              Restaurant not found
            </h1>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menus = await getMenus(params.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {restaurant.name}
              </h1>
              {restaurant.addresses && restaurant.addresses.length > 0 && (
                <p className="text-gray-600">
                  {restaurant.addresses[0].street}, {restaurant.addresses[0].city}
                  {restaurant.addresses[0].state &&
                    `, ${restaurant.addresses[0].state}`}
                  {restaurant.addresses[0].zipCode &&
                    ` ${restaurant.addresses[0].zipCode}`}
                  , {restaurant.addresses[0].country}
                </p>
              )}
            </div>
            <div className="flex space-x-4">
              <Link
                href={`/restaurants/${params.id}/orders`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Orders
              </Link>
              <Link
                href={`/restaurants/${params.id}/managers`}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Managers
              </Link>
              <Link
                href={`/restaurants/${params.id}/edit`}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Edit
              </Link>
              <DeleteRestaurantButton restaurantId={params.id} />
            </div>
          </div>

          {restaurant.contactInfo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {restaurant.contactInfo.phone && (
                <div>
                  <span className="font-medium text-gray-700">Phone: </span>
                  <span className="text-gray-600">{restaurant.contactInfo.phone}</span>
                </div>
              )}
              {restaurant.contactInfo.email && (
                <div>
                  <span className="font-medium text-gray-700">Email: </span>
                  <span className="text-gray-600">{restaurant.contactInfo.email}</span>
                </div>
              )}
              {restaurant.contactInfo.website && (
                <div>
                  <span className="font-medium text-gray-700">Website: </span>
                  <a
                    href={restaurant.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {restaurant.contactInfo.website}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Menus</h2>
          <Link
            href={`/restaurants/${params.id}/menus/new`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Create New Menu
          </Link>
        </div>

        {menus.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              No menus created yet.
            </p>
            <Link
              href={`/restaurants/${params.id}/menus/new`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Create Your First Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu: any) => (
              <Link
                key={menu._id}
                href={`/menus/${menu._id}`}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {menu.name || 'Untitled Menu'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {menu.items?.length || 0} items
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Slug: {menu.slug}
                  </span>
                  <span className="text-blue-600 text-sm font-medium">
                    Manage →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



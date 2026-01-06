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

        {/* Restaurant Header Card */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          {/* Header Section with Restaurant Colors */}
          <div
            className="px-8 py-6"
            style={{
              background: `linear-gradient(135deg, ${restaurant.primaryColor || '#3B82F6'} 0%, ${restaurant.secondaryColor || '#1E40AF'} 100%)`,
            }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {restaurant.name}
                </h1>
                {restaurant.addresses && restaurant.addresses.length > 0 && (
                  <p className="text-white/90 text-sm md:text-base">
                    📍 {restaurant.addresses[0].street}, {restaurant.addresses[0].city}
                    {restaurant.addresses[0].state &&
                      `, ${restaurant.addresses[0].state}`}
                    {restaurant.addresses[0].zipCode &&
                      ` ${restaurant.addresses[0].zipCode}`}
                    , {restaurant.addresses[0].country}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/restaurants/${params.id}/orders`}
                  className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-50 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  style={{
                    color: restaurant.primaryColor || '#3B82F6',
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Orders
                </Link>
                <Link
                  href={`/restaurants/${params.id}/managers`}
                  className="px-4 py-2 bg-white/90 text-gray-900 rounded-lg hover:bg-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  style={{
                    color: restaurant.primaryColor || '#3B82F6',
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Managers
                </Link>
                <Link
                  href={`/restaurants/${params.id}/edit`}
                  className="px-4 py-2 bg-white/90 text-gray-900 rounded-lg hover:bg-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  style={{
                    color: restaurant.primaryColor || '#3B82F6',
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </Link>
                <div className="flex items-center">
                  <DeleteRestaurantButton restaurantId={params.id} />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          {restaurant.contactInfo && (
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {restaurant.contactInfo.phone && (
                  <div className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${restaurant.primaryColor || '#3B82F6'}20`,
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: restaurant.primaryColor || '#3B82F6' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Phone
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {restaurant.contactInfo.phone}
                      </p>
                    </div>
                  </div>
                )}
                {restaurant.contactInfo.email && (
                  <div className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${restaurant.primaryColor || '#3B82F6'}20`,
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: restaurant.primaryColor || '#3B82F6' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {restaurant.contactInfo.email}
                      </p>
                    </div>
                  </div>
                )}
                {restaurant.contactInfo.website && (
                  <div className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${restaurant.primaryColor || '#3B82F6'}20`,
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: restaurant.primaryColor || '#3B82F6' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Website
                      </p>
                      <a
                        href={restaurant.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold hover:underline"
                        style={{ color: restaurant.primaryColor || '#3B82F6' }}
                      >
                        {restaurant.contactInfo.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
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
                    Token: {menu.token?.substring(0, 8)}...
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



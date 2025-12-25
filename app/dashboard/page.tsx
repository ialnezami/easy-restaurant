import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import Link from 'next/link';

async function getRestaurants(userId: string, userRole: string) {
  await connectDB();
  const { UserRole } = await import('@/models/User');

  // Admin can see all restaurants
  if (userRole === UserRole.ADMIN) {
    const restaurants = await Restaurant.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(restaurants));
  }

  // Owners and managers see restaurants they own or manage
  const restaurants = await Restaurant.find({
    $or: [{ owner: userId }, { managers: userId }],
  }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(restaurants));
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  const restaurants = await getRestaurants(
    session.user.id,
    session.user.role
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Restaurants</h1>
          <Link
            href="/restaurants/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Create New Restaurant
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              You don't have any restaurants yet.
            </p>
            <Link
              href="/restaurants/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Create Your First Restaurant
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant: any) => (
              <Link
                key={restaurant._id}
                href={`/restaurants/${restaurant._id}`}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {restaurant.name}
                </h2>
                {restaurant.addresses && restaurant.addresses.length > 0 && (
                  <p className="text-gray-600 text-sm mb-4">
                    {restaurant.addresses[0].city},{' '}
                    {restaurant.addresses[0].country}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {restaurant.contactInfo?.phone || 'No phone'}
                  </span>
                  <span className="text-blue-600 text-sm font-medium">
                    View →
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



import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import { getServerTranslations } from '@/lib/server-translations';

async function getRestaurants(userId: string, userRole: string) {
  await connectDB();
  const { UserRole } = await import('@/types/user');

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

  const { t } = await getServerTranslations();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard', 'myRestaurants')}</h1>
          <Link
            href="/restaurants/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            {t('dashboard', 'createRestaurant')}
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <div className="bg-white rounded-lg shadow">
            <EmptyState
              title={t('dashboard', 'noRestaurants')}
              description={t('dashboard', 'noRestaurantsDescription') || 'Get started by creating your first restaurant to manage menus and orders.'}
              action={{
                label: t('dashboard', 'createFirstRestaurant'),
                href: '/restaurants/new',
              }}
              icon={
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              }
            />
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
                    {restaurant.contactInfo?.phone || t('dashboard', 'noPhone')}
                  </span>
                  <span className="text-blue-600 text-sm font-medium">
                    {t('dashboard', 'view')} →
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



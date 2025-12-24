import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import RestaurantEditForm from '@/components/RestaurantEditForm';

async function getRestaurant(id: string, userId: string) {
  await connectDB();
  const restaurant = await Restaurant.findOne({
    _id: id,
    owner: userId,
  });
  return restaurant ? JSON.parse(JSON.stringify(restaurant)) : null;
}

export default async function RestaurantEditPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  const restaurant = await getRestaurant(params.id, session.user.id);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Restaurant not found
            </h1>
            <a
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Edit Restaurant
        </h1>
        <RestaurantEditForm restaurant={restaurant} />
      </div>
    </div>
  );
}

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import OrderList from '@/components/OrderList';
import Link from 'next/link';

async function getRestaurant(id: string, userId: string) {
  await connectDB();
  const restaurant = await Restaurant.findOne({
    _id: id,
    $or: [{ owner: userId }, { managers: userId }],
  });

  if (!restaurant) {
    return null;
  }

  return JSON.parse(JSON.stringify(restaurant));
}

export default async function RestaurantOrdersPage({
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
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Orders - {restaurant.name}
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all orders for this restaurant
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/restaurants/${params.id}/orders/new`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Create Order
            </Link>
            <Link
              href={`/restaurants/${params.id}/orders/display`}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Kitchen Display
            </Link>
            <Link
              href={`/restaurants/${params.id}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Restaurant
            </Link>
          </div>
        </div>

        <OrderList restaurantId={params.id} showActions={true} />
      </div>
    </div>
  );
}


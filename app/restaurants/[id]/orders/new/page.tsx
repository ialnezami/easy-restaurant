import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import Menu from '@/models/Menu';
import OrderForm from '@/components/OrderForm';
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

async function getMenus(restaurantId: string) {
  await connectDB();
  const menus = await Menu.find({ restaurant: restaurantId })
    .populate('items')
    .sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(menus));
}

export default async function NewOrderPage({
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

  const menus = await getMenus(params.id);
  
  // Get all menu items from all menus
  const allItems = menus.flatMap((menu: any) => 
    (menu.items || []).map((item: any) => ({
      ...item,
      menuName: menu.name || 'Menu',
    }))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/restaurants/${params.id}/orders`}
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
          >
            ← Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Order
          </h1>
          <p className="text-gray-600 mt-2">{restaurant.name}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {allItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                No menu items available. Please create a menu first.
              </p>
              <Link
                href={`/restaurants/${params.id}/menus/new`}
                className="text-blue-600 hover:text-blue-700"
              >
                Create Menu
              </Link>
            </div>
          ) : (
            <OrderForm
              menuId={menus[0]?._id || ''}
              restaurantId={params.id}
              items={allItems}
            />
          )}
        </div>
      </div>
    </div>
  );
}


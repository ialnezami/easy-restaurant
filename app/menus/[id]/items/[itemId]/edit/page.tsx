import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Menu, { MenuItem } from '@/models/Menu';
import Restaurant from '@/models/Restaurant';
import MenuItemEditForm from '@/components/MenuItemEditForm';

async function getMenuItem(menuId: string, itemId: string, userId: string) {
  await connectDB();
  const menu = await Menu.findById(menuId).populate('restaurant');
  if (!menu) return null;

  const restaurant = await Restaurant.findById(menu.restaurant);
  if (restaurant?.owner.toString() !== userId) {
    return null;
  }

  const item = await MenuItem.findById(itemId);
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export default async function MenuItemEditPage({
  params,
}: {
  params: { id: string; itemId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  const item = await getMenuItem(params.id, params.itemId, session.user.id);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Menu item not found
            </h1>
            <a
              href={`/menus/${params.id}`}
              className="text-blue-600 hover:text-blue-700"
            >
              Back to Menu
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
          Edit Menu Item
        </h1>
        <MenuItemEditForm menuId={params.id} item={item} />
      </div>
    </div>
  );
}


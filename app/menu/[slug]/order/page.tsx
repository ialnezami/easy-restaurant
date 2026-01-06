import connectDB from '@/lib/mongodb';
import Menu, { MenuItem } from '@/models/Menu';
import Restaurant from '@/models/Restaurant';
import OrderForm from '@/components/OrderForm';
import Link from 'next/link';

async function getMenuByToken(token: string) {
  await connectDB();
  const menu = await Menu.findOne({ token })
    .populate('restaurant')
    .populate('items');

  if (!menu) return null;

  return JSON.parse(JSON.stringify(menu));
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { table?: string };
}) {
  const menu = await getMenuByToken(params.slug);
  const tableNumber = searchParams.table || null;

  if (!menu) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Menu Not Found
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/menu/${params.slug}`}
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
          >
            ← Back to Menu
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Place Your Order
          </h1>
          <p className="text-gray-600 mt-2">
            {menu.restaurant.name} - {menu.name || 'Menu'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <OrderForm
            menuId={menu._id}
            restaurantId={menu.restaurant._id}
            items={menu.items || []}
            defaultTableNumber={tableNumber || undefined}
          />
        </div>
      </div>
    </div>
  );
}


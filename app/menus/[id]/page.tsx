import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Menu, { MenuItem } from '@/models/Menu';
import Restaurant from '@/models/Restaurant';
import Link from 'next/link';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import MenuUrlCopy from '@/components/MenuUrlCopy';

async function getMenu(id: string, userId: string) {
  await connectDB();
  const menu = await Menu.findOne({ _id: id })
    .populate('restaurant')
    .populate('items');

  if (!menu) return null;

  // Verify ownership
  const restaurant = await Restaurant.findById(menu.restaurant);
  if (restaurant?.owner.toString() !== userId) {
    return null;
  }

  return JSON.parse(JSON.stringify(menu));
}

export default async function MenuManagementPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  const menu = await getMenu(params.id, session.user.id);

  if (!menu) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Menu not found
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

  const menuUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/menu/${menu.slug}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/restaurants/${menu.restaurant._id || menu.restaurant}`}
            className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
          >
            ← Back to Restaurant
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {menu.name || 'Untitled Menu'}
                  </h1>
                  <p className="text-gray-600">
                    Restaurant: {menu.restaurant.name || 'Unknown'}
                  </p>
                </div>
                <Link
                  href={`/menus/${params.id}/items/new`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add Item
                </Link>
              </div>

              <MenuUrlCopy url={menuUrl} />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Menu Items ({menu.items?.length || 0})
              </h2>

              {!menu.items || menu.items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">
                    No items in this menu yet.
                  </p>
                  <Link
                    href={`/menus/${params.id}/items/new`}
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Add Your First Item
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {menu.items.map((item: any) => (
                    <div
                      key={item._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {item.description}
                            </p>
                          )}
                          <p className="text-blue-600 font-semibold mt-2">
                            ${item.price.toFixed(2)}
                          </p>
                          {item.category && (
                            <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Link
                            href={`/menus/${params.id}/items/${item._id}/edit`}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                QR Code
              </h2>
              <QRCodeDisplay url={menuUrl} />
              <p className="text-sm text-gray-600 mt-4 text-center">
                Scan this QR code to view the menu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


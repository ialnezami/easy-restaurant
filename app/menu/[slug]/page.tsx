import connectDB from '@/lib/mongodb';
import Menu, { MenuItem } from '@/models/Menu';
import Restaurant from '@/models/Restaurant';
import { formatPrice } from '@/lib/utils';
import { Metadata } from 'next';
import Image from 'next/image';

async function getMenuBySlug(slug: string) {
  await connectDB();
  const menu = await Menu.findOne({ slug })
    .populate('restaurant')
    .populate('items');

  if (!menu) return null;

  return JSON.parse(JSON.stringify(menu));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const menu = await getMenuBySlug(params.slug);

  if (!menu) {
    return {
      title: 'Menu Not Found',
    };
  }

  return {
    title: `${menu.restaurant.name} - ${menu.name || 'Menu'}`,
    description: `View the menu for ${menu.restaurant.name}`,
  };
}

export default async function PublicMenuPage({
  params,
}: {
  params: { slug: string };
}) {
  const menu = await getMenuBySlug(params.slug);

  if (!menu) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Menu Not Found
          </h1>
          <p className="text-gray-600">
            The menu you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Group items by category
  const itemsByCategory: { [key: string]: any[] } = {};
  const uncategorized: any[] = [];

  menu.items?.forEach((item: any) => {
    if (item.category) {
      if (!itemsByCategory[item.category]) {
        itemsByCategory[item.category] = [];
      }
      itemsByCategory[item.category].push(item);
    } else {
      uncategorized.push(item);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {menu.restaurant.name}
          </h1>
          {menu.name && (
            <p className="text-xl text-gray-600">{menu.name}</p>
          )}
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(itemsByCategory).length === 0 &&
        uncategorized.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              This menu doesn't have any items yet.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Items by Category */}
            {Object.entries(itemsByCategory).map(([category, items]) => (
              <div key={category} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item: any) => (
                    <div
                      key={item._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <span className="text-blue-600 font-semibold ml-4">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-gray-600 text-sm mt-2">
                          {item.description}
                        </p>
                      )}
                      {item.image && (
                        <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Uncategorized Items */}
            {uncategorized.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
                  Menu Items
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {uncategorized.map((item: any) => (
                    <div
                      key={item._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <span className="text-blue-600 font-semibold ml-4">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-gray-600 text-sm mt-2">
                          {item.description}
                        </p>
                      )}
                      {item.image && (
                        <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


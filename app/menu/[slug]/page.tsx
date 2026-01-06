import connectDB from '@/lib/mongodb';
import Menu, { MenuItem } from '@/models/Menu';
import Restaurant from '@/models/Restaurant';
import { formatPrice, getTranslatedMenuItemField } from '@/lib/utils';
import { getLanguage } from '@/lib/i18n';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
  const currentLang = await getLanguage();

  if (!menu) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Menu Not Found
          </h1>
          <p className="text-gray-600">
            The menu you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Get restaurant colors with defaults
  const primaryColor = menu.restaurant.primaryColor || '#3B82F6';
  const secondaryColor = menu.restaurant.secondaryColor || '#1E40AF';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Header with Hero Section */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              {/* Restaurant Logo/Cover Image */}
              {menu.restaurant.coverImage && (
                <div className="mb-4 w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
                  <Image
                    src={menu.restaurant.coverImage}
                    alt={menu.restaurant.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {menu.restaurant.name}
              </h1>
              {menu.name && (
                <p className="text-xl md:text-2xl text-white/90 font-medium">
                  {menu.name}
                </p>
              )}
              
              {/* Restaurant Info */}
              {menu.restaurant.contactInfo?.phone && (
                <p className="mt-4 text-white/80 text-sm">
                  📞 {menu.restaurant.contactInfo.phone}
                </p>
              )}
            </div>
            
            <Link
              href={`/menu/${params.slug}/order`}
              className="group relative px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              style={{
                color: primaryColor,
              }}
            >
              <span>Place Order</span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.keys(itemsByCategory).length === 0 &&
        uncategorized.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
              <svg
                className="w-12 h-12"
                style={{ color: primaryColor }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              This menu doesn&apos;t have any items yet.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Items by Category */}
            {Object.entries(itemsByCategory).map(([category, items], categoryIndex) => (
              <div
                key={category}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${categoryIndex * 0.1}s both`,
                }}
              >
                {/* Category Header */}
                <div
                  className="px-8 py-6 border-b-4"
                  style={{
                    borderColor: primaryColor,
                    background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}10 100%)`,
                  }}
                >
                  <h2 className="text-3xl font-bold" style={{ color: primaryColor }}>
                    {items.length > 0 
                      ? getTranslatedMenuItemField(items[0], 'category', currentLang)
                      : category}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>

                {/* Menu Items Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: any, itemIndex: number) => (
                      <div
                        key={item._id}
                        className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden hover:border-transparent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
                        style={{
                          animation: `fadeInUp 0.5s ease-out ${(categoryIndex * 0.1) + (itemIndex * 0.05)}s both`,
                        }}
                      >
                        {/* Item Image */}
                        {item.image && (
                          <div className="relative w-full h-48 overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              unoptimized={item.image.startsWith('http')}
                            />
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: `linear-gradient(to bottom, transparent 0%, ${primaryColor}80 100%)`,
                              }}
                            />
                          </div>
                        )}

                        {/* Item Content */}
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                              {getTranslatedMenuItemField(item, 'name', currentLang)}
                            </h3>
                            <span
                              className="text-xl font-bold ml-4 whitespace-nowrap"
                              style={{ color: primaryColor }}
                            >
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          
                          {getTranslatedMenuItemField(item, 'description', currentLang) && (
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                              {getTranslatedMenuItemField(item, 'description', currentLang)}
                            </p>
                          )}

                          {/* Category Badge */}
                          {getTranslatedMenuItemField(item, 'category', currentLang) && (
                            <span
                              className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${primaryColor}20`,
                                color: primaryColor,
                              }}
                            >
                              {getTranslatedMenuItemField(item, 'category', currentLang)}
                            </span>
                          )}
                        </div>

                        {/* Hover Effect Border */}
                        <div
                          className="absolute inset-0 border-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{ borderColor: primaryColor }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Uncategorized Items */}
            {uncategorized.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div
                  className="px-8 py-6 border-b-4"
                  style={{
                    borderColor: primaryColor,
                    background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}10 100%)`,
                  }}
                >
                  <h2 className="text-3xl font-bold" style={{ color: primaryColor }}>
                    Menu Items
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uncategorized.map((item: any) => (
                      <div
                        key={item._id}
                        className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden hover:border-transparent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
                      >
                        {item.image && (
                          <div className="relative w-full h-48 overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              unoptimized={item.image.startsWith('http')}
                            />
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: `linear-gradient(to bottom, transparent 0%, ${primaryColor}80 100%)`,
                              }}
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {getTranslatedMenuItemField(item, 'name', currentLang)}
                            </h3>
                            <span
                              className="text-xl font-bold ml-4"
                              style={{ color: primaryColor }}
                            >
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          {getTranslatedMenuItemField(item, 'description', currentLang) && (
                            <p className="text-gray-600 text-sm mt-2">
                              {getTranslatedMenuItemField(item, 'description', currentLang)}
                            </p>
                          )}
                        </div>
                        <div
                          className="absolute inset-0 border-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{ borderColor: primaryColor }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-gray-600 text-sm">
        <p>Powered by Easy Restaurant</p>
      </footer>
    </div>
  );
}

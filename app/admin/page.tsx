import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Restaurant from '@/models/Restaurant';
import Menu from '@/models/Menu';
import { MenuItem } from '@/models/Menu';
import Order, { OrderStatus } from '@/models/Order';
import Link from 'next/link';
import StatisticsCard from '@/components/StatisticsCard';

// Simple SVG icons
const UsersIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const BuildingStorefrontIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ClipboardDocumentListIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const CurrencyDollarIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

async function getAllUsers() {
  await connectDB();
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(users));
}

async function getStatistics() {
  await connectDB();

  const [
    totalUsers,
    totalOwners,
    totalManagers,
    totalAdmins,
    totalRestaurants,
    totalMenus,
    totalMenuItems,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: UserRole.OWNER }),
    User.countDocuments({ role: UserRole.MANAGER }),
    User.countDocuments({ role: UserRole.ADMIN }),
    Restaurant.countDocuments(),
    Menu.countDocuments(),
    MenuItem.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: OrderStatus.PENDING }),
    Order.countDocuments({ status: OrderStatus.COMPLETED }),
    Order.aggregate([
      { $match: { status: OrderStatus.COMPLETED } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ]);

  const revenue = totalRevenue[0]?.total || 0;

  return {
    totalUsers,
    totalOwners,
    totalManagers,
    totalAdmins,
    totalRestaurants,
    totalMenus,
    totalMenuItems,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue: revenue,
  };
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/login');
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect('/dashboard');
  }

  const users = await getAllUsers();
  const stats = await getStatistics();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800';
      case UserRole.MANAGER:
        return 'bg-blue-100 text-blue-800';
      case UserRole.OWNER:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              User Management
            </Link>
            <Link
              href="/admin/languages"
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
            >
              Language Settings
            </Link>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <StatisticsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<UsersIcon />}
              color="blue"
              subtitle={`${stats.totalOwners} owners, ${stats.totalManagers} managers, ${stats.totalAdmins} admins`}
            />
            <StatisticsCard
              title="Total Restaurants"
              value={stats.totalRestaurants}
              icon={<BuildingStorefrontIcon />}
              color="green"
            />
            <StatisticsCard
              title="Total Menus"
              value={stats.totalMenus}
              icon={<DocumentTextIcon />}
              color="purple"
              subtitle={`${stats.totalMenuItems} menu items`}
            />
            <StatisticsCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingCartIcon />}
              color="orange"
              subtitle={`${stats.pendingOrders} pending, ${stats.completedOrders} completed`}
            />
            <StatisticsCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toFixed(2)}`}
              icon={<CurrencyDollarIcon />}
              color="indigo"
              subtitle="From completed orders"
            />
            <StatisticsCard
              title="Pending Orders"
              value={stats.pendingOrders}
              icon={<ClipboardDocumentListIcon />}
              color="red"
            />
            <StatisticsCard
              title="Owners"
              value={stats.totalOwners}
              icon={<UsersIcon />}
              color="green"
            />
            <StatisticsCard
              title="Managers"
              value={stats.totalManagers}
              icon={<UsersIcon />}
              color="blue"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage all users in the system</p>
          </div>
          <Link
            href="/admin/users/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Create New User
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: any) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/users/${user._id}/edit`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    {user._id !== session.user.id && (
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


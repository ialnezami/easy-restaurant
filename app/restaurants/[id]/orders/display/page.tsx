'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { OrderStatus } from '@/models/Order';
import OrderCard from '@/components/OrderCard';
import { useTranslations } from '@/lib/use-translations';

interface Order {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName?: string;
  tableNumber?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  assignedStaff?: { name: string };
  staffType?: string;
  createdAt: string;
}

export default function KitchenDisplayPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const { t } = useTranslations();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');

  const fetchOrders = useCallback(async () => {
    try {
      let url = `/api/restaurants/${restaurantId}/orders`;
      if (filterStatus) {
        url += `?status=${filterStatus}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        // Filter out completed orders for display
        const activeOrders = (data.orders || []).filter(
          (order: Order) => order.status !== OrderStatus.COMPLETED
        );
        setOrders(activeOrders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  }, [restaurantId, filterStatus]);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 3 seconds
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Group orders by status
  const ordersByStatus = {
    [OrderStatus.PENDING]: orders.filter((o) => o.status === OrderStatus.PENDING),
    [OrderStatus.PREPARING]: orders.filter((o) => o.status === OrderStatus.PREPARING),
    [OrderStatus.READY]: orders.filter((o) => o.status === OrderStatus.READY),
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('order', 'kitchenDisplay')}
          </h1>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => setFilterStatus('')}
              className={`px-4 py-2 rounded-md ${
                filterStatus === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              All
            </button>
            {Object.values(OrderStatus)
              .filter((s) => s !== OrderStatus.COMPLETED)
              .map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-md ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {t('order', `status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
                </button>
              ))}
          </div>
        </div>

        {/* Orders Grid - Large display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filterStatus ? (
            // Show filtered orders
            ordersByStatus[filterStatus as OrderStatus]?.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))
          ) : (
            // Show all orders grouped by status
            <>
              {ordersByStatus[OrderStatus.PENDING].map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
              {ordersByStatus[OrderStatus.PREPARING].map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
              {ordersByStatus[OrderStatus.READY].map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </>
          )}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">{t('order', 'noOrders')}</p>
          </div>
        )}
      </div>
    </div>
  );
}


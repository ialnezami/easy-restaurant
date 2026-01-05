'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { OrderStatus } from '@/models/Order';
import { useTranslations } from '@/lib/use-translations';
import Loading from '@/components/Loading';
import Error from '@/components/Error';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName?: string;
  tableNumber?: string;
  items: OrderItem[];
  totalPrice: number;
  restaurant: { name: string };
  createdAt: string;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const { t } = useTranslations();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Order not found');
      }

      setOrder(data.order);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!order) return <Error message={t('order', 'orderNotFound')} />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('order', 'yourOrderStatus')}
            </h1>
            <p className="text-gray-600">
              {t('order', 'orderNumber')}: {order.orderNumber}
            </p>
          </div>

          {/* Status Display */}
          <div className="text-center mb-8">
            <OrderStatusBadge status={order.status} size="lg" />
          </div>

          {/* Restaurant Info */}
          <div className="mb-6 pb-6 border-b">
            <p className="text-sm text-gray-600">
              {t('restaurant', 'name')}: {order.restaurant.name}
            </p>
            {order.customerName && (
              <p className="text-sm text-gray-600 mt-1">
                {t('order', 'customerName')}: {order.customerName}
              </p>
            )}
            {order.tableNumber && (
              <p className="text-sm text-gray-600 mt-1">
                {t('order', 'tableNumber')}: {order.tableNumber}
              </p>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('order', 'items')}
            </h2>
            <ul className="space-y-3">
              {order.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.quantity}x {item.name}
                    </p>
                    {item.notes && (
                      <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                    )}
                  </div>
                  <p className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Total */}
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">
              {t('order', 'totalPrice')}:
            </span>
            <span className="text-2xl font-bold text-gray-900">
              ${order.totalPrice.toFixed(2)}
            </span>
          </div>

          {/* Status Timeline */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Order Progress
            </h3>
            <div className="space-y-3">
              {[
                OrderStatus.PENDING,
                OrderStatus.PREPARING,
                OrderStatus.READY,
                OrderStatus.COMPLETED,
              ].map((status, index) => {
                const isActive = order.status === status;
                const isCompleted =
                  ['pending', 'preparing', 'ready', 'completed'].indexOf(
                    order.status
                  ) >= index;

                return (
                  <div key={status} className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div
                      className={`flex-1 ${
                        isActive ? 'font-semibold' : 'text-gray-500'
                      }`}
                    >
                      {t('order', `status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


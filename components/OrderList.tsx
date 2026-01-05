'use client';

import { useState, useEffect, useCallback } from 'react';
import { OrderStatus } from '@/models/Order';
import OrderCard from './OrderCard';
import OrderStatusBadge from './OrderStatusBadge';
import { useTranslations } from '@/lib/use-translations';
import { getStaffTypeLabel } from '@/lib/order-translations';
import Loading from './Loading';
import Error from './Error';

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
    notes?: string;
  }>;
  totalPrice: number;
  assignedStaff?: { name: string };
  staffType?: string;
  createdAt: string;
  restaurant?: { _id: string };
}

interface OrderListProps {
  restaurantId?: string;
  staffView?: boolean;
  showActions?: boolean;
  filterByStatus?: OrderStatus;
  filterByStaffType?: string;
}

export default function OrderList({
  restaurantId,
  staffView = false,
  showActions = false,
  filterByStatus,
  filterByStaffType,
}: OrderListProps) {
  const { lang, t } = useTranslations();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>(
    filterByStatus || ''
  );
  const [selectedStaffType, setSelectedStaffType] = useState(
    filterByStaffType || ''
  );

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      let url = '';
      const params = new URLSearchParams();
      
      if (staffView) {
        url = '/api/staff/orders';
        if (selectedStatus) params.append('status', selectedStatus);
        if (selectedStaffType) params.append('staffType', selectedStaffType);
        if (restaurantId) params.append('restaurantId', restaurantId);
      } else {
        if (!restaurantId) {
          setError('Restaurant ID is required');
          return;
        }
        url = `/api/restaurants/${restaurantId}/orders`;
        if (selectedStatus) params.append('status', selectedStatus);
        if (selectedStaffType) params.append('staffType', selectedStaffType);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [restaurantId, selectedStatus, selectedStaffType, staffView]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const order = orders.find((o) => o._id === orderId);
      if (!order || !restaurantId) return;

      const response = await fetch(
        `/api/restaurants/${restaurantId}/orders/${orderId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchOrders(); // Refresh list
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleAssign = async (orderId: string) => {
    try {
      const response = await fetch(`/api/staff/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assign: true }),
      });

      if (response.ok) {
        fetchOrders(); // Refresh list
      }
    } catch (err) {
      console.error('Error assigning order:', err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const staffTypes = ['grillade', 'sandwich', 'drinks', 'desserts', 'other'];

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('order', 'filterByStatus')}
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | '')}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">{t('common', 'all')}</option>
            {Object.values(OrderStatus).map((status) => {
              const statusKey = `status${status.charAt(0).toUpperCase() + status.slice(1)}`;
              return (
                <option key={status} value={status}>
                  {t('order', statusKey)}
                </option>
              );
            })}
          </select>
        </div>

        {staffView && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('order', 'filterByStaffType')}
            </label>
            <select
              value={selectedStaffType}
              onChange={(e) => setSelectedStaffType(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">{t('common', 'all') || 'All'}</option>
              {staffTypes.map((type) => (
                <option key={type} value={type}>
                  {getStaffTypeLabel(lang, type)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('order', 'noOrders')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              showActions={showActions}
              onStatusChange={handleStatusChange}
              onAssign={handleAssign}
            />
          ))}
        </div>
      )}
    </div>
  );
}


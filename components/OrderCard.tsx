'use client';

import { OrderStatus } from '@/models/Order';
import OrderStatusBadge from './OrderStatusBadge';
import { useTranslations } from '@/lib/use-translations';
import { getStaffTypeLabel } from '@/lib/order-translations';
import Link from 'next/link';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface OrderCardProps {
  order: {
    _id: string;
    orderNumber: string;
    status: OrderStatus;
    customerName?: string;
    tableNumber?: string;
    items: OrderItem[];
    totalPrice: number;
    assignedStaff?: { name: string };
    staffType?: string;
    createdAt: string;
    restaurant?: { _id: string };
  };
  showActions?: boolean;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
  onAssign?: (orderId: string) => void;
  currentUserId?: string;
}

export default function OrderCard({
  order,
  showActions = false,
  onStatusChange,
  onAssign,
  currentUserId,
}: OrderCardProps) {
  const { lang, t } = useTranslations();
  const isAssigned = order.assignedStaff && order.assignedStaff.name;
  const canAssign = !isAssigned && onAssign;

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (onStatusChange) {
      onStatusChange(order._id, newStatus);
    }
  };

  const handleAssign = () => {
    if (onAssign) {
      onAssign(order._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {t('order', 'orderNumber')}: {order.orderNumber}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>
          {order.customerName && (
            <p className="text-sm text-gray-600">
              {t('order', 'customerName')}: {order.customerName}
            </p>
          )}
          {order.tableNumber && (
            <p className="text-sm text-gray-600">
              {t('order', 'tableNumber')}: {order.tableNumber}
            </p>
          )}
          {order.staffType && (
            <p className="text-sm text-gray-500 mt-1">
              {t('order', 'staffType')}: {getStaffTypeLabel(lang, order.staffType)}
            </p>
          )}
          {isAssigned && order.assignedStaff && (
            <p className="text-sm text-gray-500 mt-1">
              {t('order', 'assignedStaff')}: {order.assignedStaff.name}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            ${order.totalPrice.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          {t('order', 'items')}:
        </h4>
        <ul className="space-y-1">
          {order.items.map((item, index) => (
            <li key={index} className="text-sm text-gray-600 flex justify-between">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {showActions && (
        <div className="border-t pt-4 flex flex-wrap gap-2">
          {canAssign && (
            <button
              onClick={handleAssign}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('order', 'assignOrder')}
            </button>
          )}
          {order.status === OrderStatus.PENDING && (
            <button
              onClick={() => handleStatusChange(OrderStatus.PREPARING)}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('order', 'markAsPreparing')}
            </button>
          )}
          {order.status === OrderStatus.PREPARING && (
            <button
              onClick={() => handleStatusChange(OrderStatus.READY)}
              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              {t('order', 'markAsReady')}
            </button>
          )}
          {order.status === OrderStatus.READY && (
            <button
              onClick={() => handleStatusChange(OrderStatus.COMPLETED)}
              className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
            >
              {t('order', 'markAsCompleted')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}


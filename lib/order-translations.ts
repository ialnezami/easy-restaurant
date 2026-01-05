import { OrderStatus } from '@/models/Order';
import { t } from './translations';

export const OrderStatusConfig = {
  [OrderStatus.PENDING]: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
    priority: 1,
  },
  [OrderStatus.PREPARING]: {
    color: 'bg-blue-100 text-blue-800',
    icon: '👨‍🍳',
    priority: 2,
  },
  [OrderStatus.READY]: {
    color: 'bg-green-100 text-green-800',
    icon: '✅',
    priority: 3,
  },
  [OrderStatus.COMPLETED]: {
    color: 'bg-gray-100 text-gray-800',
    icon: '✓',
    priority: 4,
  },
};

export function getOrderStatusLabel(lang: string, status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'statusPending',
    [OrderStatus.PREPARING]: 'statusPreparing',
    [OrderStatus.READY]: 'statusReady',
    [OrderStatus.COMPLETED]: 'statusCompleted',
  };
  
  return t(lang, 'order', statusMap[status]);
}

export function getStaffTypeLabel(lang: string, staffType: string): string {
  const typeMap: Record<string, string> = {
    grillade: 'staffTypeGrillade',
    sandwich: 'staffTypeSandwich',
    drinks: 'staffTypeDrinks',
    desserts: 'staffTypeDesserts',
    other: 'staffTypeOther',
  };
  
  return t(lang, 'order', typeMap[staffType] || 'staffTypeOther');
}


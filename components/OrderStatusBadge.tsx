'use client';

import { OrderStatus } from '@/models/Order';
import { OrderStatusConfig, getOrderStatusLabel } from '@/lib/order-translations';
import { useTranslations } from '@/lib/use-translations';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function OrderStatusBadge({
  status,
  size = 'md',
}: OrderStatusBadgeProps) {
  const { lang } = useTranslations();
  const config = OrderStatusConfig[status];
  const label = getOrderStatusLabel(lang, status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.color} ${sizeClasses[size]}`}
    >
      <span className="mr-1.5">{config.icon}</span>
      {label}
    </span>
  );
}


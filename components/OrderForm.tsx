'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/use-translations';
import Error from './Error';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description?: string;
}

interface OrderFormProps {
  menuId: string;
  restaurantId: string;
  items: MenuItem[];
  onSuccess?: (orderNumber: string) => void;
}

export default function OrderForm({
  menuId,
  restaurantId,
  items,
  onSuccess,
}: OrderFormProps) {
  const router = useRouter();
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    tableNumber: '',
    notes: '',
  });
  const [orderItems, setOrderItems] = useState<
    Array<{ menuItem: string; quantity: number; notes?: string }>
  >([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddItem = (itemId: string) => {
    const existingItem = orderItems.find((i) => i.menuItem === itemId);
    if (existingItem) {
      setOrderItems(
        orderItems.map((i) =>
          i.menuItem === itemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setOrderItems([...orderItems, { menuItem: itemId, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(orderItems.filter((i) => i.menuItem !== itemId));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setOrderItems(
      orderItems.map((i) =>
        i.menuItem === itemId ? { ...i, quantity } : i
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (orderItems.length === 0) {
      setError('Please add at least one item to the order');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderItems,
          customerName: formData.customerName || null,
          customerPhone: formData.customerPhone || null,
          tableNumber: formData.tableNumber || null,
          notes: formData.notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create order');
        return;
      }

      if (onSuccess) {
        onSuccess(data.order.orderNumber);
      } else {
        router.push(`/orders/success?orderNumber=${data.order.orderNumber}`);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getItemQuantity = (itemId: string) => {
    const item = orderItems.find((i) => i.menuItem === itemId);
    return item?.quantity || 0;
  };

  const getTotal = () => {
    return orderItems.reduce((total, orderItem) => {
      const menuItem = items.find((i) => i._id === orderItem.menuItem);
      return total + (menuItem?.price || 0) * orderItem.quantity;
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Error message={error} />}

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('order', 'customerName')} (optional)
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('order', 'customerPhone')} (optional)
          </label>
          <input
            type="tel"
            value={formData.customerPhone}
            onChange={(e) =>
              setFormData({ ...formData, customerPhone: e.target.value })
            }
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('order', 'tableNumber')} (optional)
          </label>
          <input
            type="text"
            value={formData.tableNumber}
            onChange={(e) =>
              setFormData({ ...formData, tableNumber: e.target.value })
            }
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Menu Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('order', 'items')}
        </h3>
        <div className="space-y-3">
          {items.map((item) => {
            const quantity = getItemQuantity(item._id);
            return (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-500">{item.description}</p>
                  )}
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {quantity > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item._id, quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item._id, quantity + 1)}
                        className="w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                      >
                        +
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddItem(item._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      {t('order', 'addItem')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      {orderItems.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">{t('order', 'totalPrice')}:</span>
            <span className="text-2xl font-bold text-gray-900">
              ${getTotal().toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('order', 'notes')} (optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || orderItems.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : t('order', 'placeOrder')}
        </button>
      </div>
    </form>
  );
}


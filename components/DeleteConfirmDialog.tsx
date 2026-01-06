'use client';

import { useTranslations } from '@/lib/use-translations';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  translationKey?: {
    title: string;
    message: string;
  };
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  translationKey,
}: DeleteConfirmDialogProps) {
  const { t } = useTranslations();
  
  if (!isOpen) return null;

  const dialogTitle = translationKey 
    ? t(translationKey.title.split('.')[0] as any, translationKey.title.split('.')[1])
    : (title || t('common', 'delete'));
  
  const dialogMessage = translationKey
    ? t(translationKey.message.split('.')[0] as any, translationKey.message.split('.')[1])
    : (message || '');

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{dialogTitle}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              {dialogMessage}
              {itemName && (
                <span className="font-semibold text-gray-900">
                  {' '}
                  &quot;{itemName}&quot;?
                </span>
              )}
            </p>
          </div>
          <div className="flex justify-end space-x-3 px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              {t('common', 'cancel')}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              {t('common', 'delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-lg font-semibold text-gray-900">{dialogTitle}</h3>
        </div>
        
        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            {dialogMessage}
            {itemName && (
              <span className="font-semibold text-gray-900 block mt-2">
                &quot;{itemName}&quot;?
              </span>
            )}
          </p>
        </div>
        
        {/* Footer with buttons */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {t('common', 'cancel')}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
            >
              {t('common', 'delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


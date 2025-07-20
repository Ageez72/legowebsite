'use client';
import { toast } from 'react-hot-toast';

export const showWarningToast = (message, lang = 'EN', title = 'Warning') => {
  toast.custom((t) => (
    <div
      className={`z-9999 w-auto max-w-sm bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg animate-slide-in`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <i className="icon-warning-2 text-yellow-500 text-lg"></i>
        </div>
        <div className="text-start flex-1 text-sm">
          <strong className="block font-bold mb-1">{title}</strong>
          <span>{message}</span>
        </div>
      </div>
    </div>
  ));
};

export const showSuccessToast = (message, lang = 'EN', title = 'Success') => {
  toast.custom((t) => (
    <div
      className={`z-9999 w-auto max-w-sm bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg animate-slide-in`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <i className="icon-warning-2 text-green-500 text-lg"></i>
        </div>
        <div className="text-start flex-1 text-sm">
          <strong className="block font-bold mb-1">{title}</strong>
          <span>{message}</span>
        </div>
      </div>
    </div>
  ));
};

export const showErrorToast = (message, lang = 'EN', title = 'Error') => {
  toast.custom((t) => (
    <div
      className={`z-9999 w-auto max-w-sm bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg animate-slide-in`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <i className="icon-warning-2 text-red-500 text-lg"></i>
        </div>
        <div className="text-start flex-1 text-sm">
          <strong className="block font-bold mb-1">{title}</strong>
          <span>{message}</span>
        </div>
      </div>
    </div>
  ));
};

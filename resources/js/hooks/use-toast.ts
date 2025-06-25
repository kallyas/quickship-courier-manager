import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface FlashMessages {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
}

interface PageProps {
  flash: FlashMessages;
  [key: string]: unknown;
}

export function useToast() {
  const { props } = usePage<PageProps>();
  const { flash } = props;

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
    if (flash?.warning) {
      toast.warning(flash.warning);
    }
    if (flash?.info) {
      toast.info(flash.info);
    }
  }, [flash]);

  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    warning: (message: string) => toast.warning(message),
    info: (message: string) => toast.info(message),
    promise: (promise: Promise<unknown>, messages: {
      loading: string;
      success: string;
      error: string;
    }) => toast.promise(promise, messages),
  };
}
import { ApiResponse } from '@/types/commons';
import { toast } from 'sonner';

export const withLoadingToast = <
  T extends (...args: any[]) => Promise<ApiResponse>,
>(
  fn: T,
  {
    loadingMessage = 'Loading...',
    successMessage = 'Success!',
    errorMessage = 'Something went wrong',
  } = {}
) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const promise = fn(...args);

    toast.promise(promise, {
      loading: loadingMessage,
      success: (result) => {
        if (result.status === 'success') {
          return result.message || successMessage;
        }

        throw new Error(result.message || errorMessage);
      },
      error: (error) => {
        if (error instanceof Error) {
          return error.message;
        }
        return error?.message || errorMessage;
      },
    });

    return promise as ReturnType<T>;
  };
};

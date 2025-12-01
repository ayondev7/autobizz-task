import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export function useApiQuery(key, url, params = {}, options = {}) {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key, params],
    queryFn: async () => {
      const response = await axiosInstance.get(url, { params });
      return response.data;
    },
    ...options,
  });
}

export function useApiMutation(url, options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(url, data);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      if (options.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);
    },
    ...options,
  });
}

export function usePrefetch(key, url, params = {}) {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: Array.isArray(key) ? key : [key, params],
      queryFn: async () => {
        const response = await axiosInstance.get(url, { params });
        return response.data;
      },
    });
  };
}

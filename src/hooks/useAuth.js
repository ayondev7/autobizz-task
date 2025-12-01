import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/routes/api";

export function useAuthorization() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(API_ROUTES.AUTHORIZE);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.key) {
        localStorage.setItem("authToken", data.key);
        queryClient.invalidateQueries({ queryKey: ["sales"] });
      }
    },
  });

  const checkAndAuthorize = async () => {
    const existingToken = localStorage.getItem("authToken");
    if (!existingToken) {
      return mutation.mutateAsync();
    }
    return { key: existingToken };
  };

  return {
    authorize: mutation.mutate,
    authorizeAsync: mutation.mutateAsync,
    checkAndAuthorize,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}

export function useAuthToken() {
  return useQuery({
    queryKey: ["authToken"],
    queryFn: () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("authToken");
      }
      return null;
    },
    staleTime: Infinity,
  });
}

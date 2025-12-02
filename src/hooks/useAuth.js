import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { isTokenValid, setAuthToken, getToken } from "@/lib/axios";
import { API_ROUTES } from "@/routes/api";

export function useAuthorization() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(API_ROUTES.AUTHORIZE, {
        tokenType: "frontEndTest",
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.token) {
        setAuthToken(data.token, data.expire);
        queryClient.invalidateQueries({ queryKey: ["sales"] });
      }
    },
    onError: (error) => {
      console.error("[useAuth] onError:", error);
    },
  });

  const checkAndAuthorize = async () => {
    if (isTokenValid()) {
      const token = getToken();
      return { token };
    }
    return mutation.mutateAsync();
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

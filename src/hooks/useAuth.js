import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { isTokenValid } from "@/lib/axios";
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
        const authData = {
          token: data.token,
          expiresAt: Date.now() + data.expire * 1000,
        };
        localStorage.setItem("authData", JSON.stringify(authData));
        queryClient.invalidateQueries({ queryKey: ["sales"] });
      }
    },
  });

  const checkAndAuthorize = async () => {
    if (isTokenValid()) {
      const authData = JSON.parse(localStorage.getItem("authData"));
      return { token: authData.token };
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

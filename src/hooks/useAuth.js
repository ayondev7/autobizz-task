import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { isTokenValid, setAuthToken, getToken } from "@/lib/axios";
import { API_ROUTES } from "@/routes/api";

export function useAuthorization() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      console.log("[useAuth] Making POST request to getAuthorize");
      console.log("[useAuth] Request body:", { tokenType: "frontEndTest" });
      
      const response = await axiosInstance.post(API_ROUTES.AUTHORIZE, {
        tokenType: "frontEndTest",
      });
      
      console.log("[useAuth] Response received:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("[useAuth] onSuccess - data:", data);
      if (data?.token) {
        console.log("[useAuth] Storing token in cookie, expires in:", data.expire, "seconds");
        setAuthToken(data.token, data.expire);
        queryClient.invalidateQueries({ queryKey: ["sales"] });
      }
    },
    onError: (error) => {
      console.error("[useAuth] onError:", error);
    },
  });

  const checkAndAuthorize = async () => {
    console.log("[useAuth] checkAndAuthorize called");
    if (isTokenValid()) {
      const token = getToken();
      console.log("[useAuth] Token is valid, reusing:", token);
      return { token };
    }
    console.log("[useAuth] Token invalid or missing, fetching new token");
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

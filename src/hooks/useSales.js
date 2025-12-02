import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/routes/api";

export function useSales(filters = {}, enabled = false) {
  const {
    startDate = "",
    endDate = "",
    priceMin = "",
    email = "",
    phone = "",
    sortBy = "date",
    sortOrder = "asc",
    before = "",
    after = "",
  } = filters;

  // Build params object with all query parameters (even empty ones)
  const params = {
    startDate,
    endDate,
    priceMin,
    email,
    phone,
    sortBy,
    sortOrder,
    before,
    after,
  };

  // Create a stable query key by sorting and stringifying params
  const queryKey = ["sales", JSON.stringify(params)];

  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log("[useSales] Fetching sales with params:", params);
      
      const response = await axiosInstance.get(API_ROUTES.SALES, { params });
      
      console.log("[useSales] Response received:");
      console.log("[useSales] Sales count:", response.data?.results?.Sales?.length);
      
      return response.data;
    },
    enabled: enabled,
    staleTime: Infinity, // Data never goes stale - won't refetch automatically
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnReconnect: false, // Don't refetch on network reconnect
  });
}

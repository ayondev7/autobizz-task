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

  return useQuery({
    queryKey: ["sales", params],
    queryFn: async () => {
      console.log("[useSales] Fetching sales with params:", params);
      console.log("[useSales] Full URL will be:", `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ROUTES.SALES}?startDate=${startDate}&endDate=${endDate}&priceMin=${priceMin}&email=${email}&phone=${phone}&sortBy=${sortBy}&sortOrder=${sortOrder}&after=${after}&before=${before}`);
      
      const response = await axiosInstance.get(API_ROUTES.SALES, { params });
      
      console.log("[useSales] Response received:");
      console.log("[useSales] TotalSales:", response.data?.results?.TotalSales);
      console.log("[useSales] Sales count:", response.data?.results?.Sales?.length);
      console.log("[useSales] Pagination:", response.data?.pagination);
      
      return response.data;
    },
    enabled: enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

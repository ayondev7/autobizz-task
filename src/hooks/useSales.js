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

  const queryKey = ["sales", JSON.stringify(params)];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get(API_ROUTES.SALES, { params });
      return response.data;
    },
    enabled: enabled,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

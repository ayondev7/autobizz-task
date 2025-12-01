import { useQuery } from "@tanstack/react-query";
import axiosInstance, { isTokenValid } from "@/lib/axios";
import { API_ROUTES } from "@/routes/api";

export function useSales(filters = {}) {
  const {
    startDate,
    endDate,
    priceMin,
    email,
    phone,
    sortBy,
    sortOrder,
    before,
    after,
  } = filters;

  const params = {};

  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (priceMin) params.priceMin = priceMin;
  if (email) params.email = email;
  if (phone) params.phone = phone;
  if (sortBy) params.sortBy = sortBy;
  if (sortOrder) params.sortOrder = sortOrder;
  if (before) params.before = before;
  if (after) params.after = after;

  return useQuery({
    queryKey: ["sales", params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_ROUTES.SALES, { params });
      return response.data;
    },
    enabled: typeof window !== "undefined" && isTokenValid(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

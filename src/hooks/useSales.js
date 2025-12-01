import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/routes/api";

export function useSales(filters = {}) {
  const {
    startDate,
    endDate,
    minPrice,
    customerEmail,
    phone,
    sortBy,
    order,
    before,
    after,
    limit = 50,
  } = filters;

  const params = {};

  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (minPrice) params.minPrice = minPrice;
  if (customerEmail) params.customerEmail = customerEmail;
  if (phone) params.phone = phone;
  if (sortBy) params.sortBy = sortBy;
  if (order) params.order = order;
  if (before) params.before = before;
  if (after) params.after = after;
  if (limit) params.limit = limit;

  return useQuery({
    queryKey: ["sales", params],
    queryFn: async () => {
      const response = await axiosInstance.get(API_ROUTES.SALES, { params });
      return response.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("authToken"),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

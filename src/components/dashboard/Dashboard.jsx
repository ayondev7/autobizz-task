"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthorization } from "@/hooks/useAuth";
import { useSales } from "@/hooks/useSales";
import Filters from "@/components/dashboard/Filters";
import SalesChart from "@/components/dashboard/SalesChart";
import SalesTable from "@/components/dashboard/SalesTable";
import Pagination from "@/components/dashboard/Pagination";
import StatsCards from "@/components/dashboard/StatsCards";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { FiBarChart2 } from "react-icons/fi";

const initialFilters = {
  startDate: "",
  endDate: "",
  priceMin: "",
  email: "",
  phone: "",
};

const initialSort = {
  sortBy: "",
  sortOrder: "",
};

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [paginationTokens, setPaginationTokens] = useState({
    before: null,
    after: null,
  });
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [lastDirection, setLastDirection] = useState(null);

  const debouncedFilters = useDebounce(filters, 500);

  const { checkAndAuthorize, isLoading: authLoading } = useAuthorization();

  const salesQueryParams = {
    startDate: debouncedFilters.startDate || "",
    endDate: debouncedFilters.endDate || "",
    priceMin: debouncedFilters.priceMin || "",
    email: debouncedFilters.email || "",
    phone: debouncedFilters.phone || "",
    sortBy: sortConfig.sortBy || "date",
    sortOrder: sortConfig.sortOrder || "asc",
    before: paginationTokens.before || "",
    after: paginationTokens.after || "",
  };

  const {
    data: salesData,
    isLoading: salesLoading,
    isFetching,
  } = useSales(salesQueryParams, isAuthorized);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isAuthorized) return;
    
    const initAuth = async () => {
      try {
        const result = await checkAndAuthorize();
        setIsAuthorized(true);
      } catch (error) {
        console.error("[Dashboard] Auth error:", error);
        setIsAuthorized(false);
      }
    };
    initAuth();
  }, [mounted, isAuthorized, checkAndAuthorize]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPaginationTokens({ before: null, after: null });
    setNavigationHistory([]);
    setLastDirection(null);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSortConfig(initialSort);
    setPaginationTokens({ before: null, after: null });
    setNavigationHistory([]);
    setLastDirection(null);
  }, []);

  const handleSort = useCallback((newSortConfig) => {
    setSortConfig(newSortConfig);
    setPaginationTokens({ before: null, after: null });
    setNavigationHistory([]);
    setLastDirection(null);
  }, []);

  const handlePrevious = useCallback(() => {
    if (navigationHistory.length > 0) {
      const newHistory = [...navigationHistory];
      const previousTokens = newHistory.pop();
      setNavigationHistory(newHistory);
      setPaginationTokens(previousTokens);
      setLastDirection("prev");
      return;
    }
    
    if (salesData?.pagination?.before) {
      setNavigationHistory((prev) => [...prev, paginationTokens]);
      setPaginationTokens({
        before: salesData.pagination.before,
        after: null,
      });
      setLastDirection("prev");
    }
  }, [salesData?.pagination?.before, navigationHistory, paginationTokens]);

  const handleNext = useCallback(() => {
    if (lastDirection === "prev" && navigationHistory.length > 0 && !salesData?.pagination?.before) {
      const newHistory = [...navigationHistory];
      const nextTokens = newHistory.pop();
      setNavigationHistory(newHistory);
      setPaginationTokens(nextTokens);
      setLastDirection("next");
      return;
    }
    
    if (salesData?.pagination?.after) {
      setNavigationHistory((prev) => [...prev, paginationTokens]);
      setPaginationTokens({
        before: null,
        after: salesData.pagination.after,
      });
      setLastDirection("next");
    }
  }, [salesData?.pagination?.after, salesData?.pagination?.before, navigationHistory, paginationTokens, lastDirection]);

  
  const isFirstPage = navigationHistory.length === 0 && !paginationTokens.before && !paginationTokens.after;
  const canGoPrevious = !isFirstPage && (navigationHistory.length > 0 || salesData?.pagination?.before);
  
  
  const wentTooFarBack = lastDirection === "prev" && !salesData?.pagination?.before && navigationHistory.length > 0;
  const canGoNext = salesData?.pagination?.after || wentTooFarBack;

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Spinner size="xl" />
        </div>
      </div>
    );
  }

  const totalSalesData = salesData?.results?.TotalSales || [];
  const salesItems = salesData?.results?.Sales || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FiBarChart2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Sales Dashboard
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Track and analyze your sales performance
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Card>

          <StatsCards totalSalesData={totalSalesData} salesData={salesItems} />

          <SalesChart data={totalSalesData} isLoading={salesLoading && !isFetching} />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Sales Records</h2>
              {isFetching && !salesLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner size="sm" />
                  Updating...
                </div>
              )}
            </div>
            <SalesTable
              data={salesItems}
              isLoading={salesLoading}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
            <Pagination
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isLoading={salesLoading || isFetching}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

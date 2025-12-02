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

  console.log("[Dashboard] Sales query params:", salesQueryParams);

  const {
    data: salesData,
    isLoading: salesLoading,
    isFetching,
  } = useSales(salesQueryParams, isAuthorized);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const initAuth = async () => {
      console.log("[Dashboard] Initializing auth...");
      try {
        const result = await checkAndAuthorize();
        console.log("[Dashboard] Auth result:", result);
        setIsAuthorized(true);
      } catch (error) {
        console.error("[Dashboard] Auth error:", error);
        setIsAuthorized(false);
      }
    };
    initAuth();
  }, [mounted]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPaginationTokens({ before: null, after: null });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSortConfig(initialSort);
    setPaginationTokens({ before: null, after: null });
  }, []);

  const handleSort = useCallback((newSortConfig) => {
    setSortConfig(newSortConfig);
    setPaginationTokens({ before: null, after: null });
  }, []);

  const handlePrevious = useCallback(() => {
    if (salesData?.pagination?.before) {
      setPaginationTokens({
        before: salesData.pagination.before,
        after: null,
      });
    }
  }, [salesData?.pagination?.before]);

  const handleNext = useCallback(() => {
    if (salesData?.pagination?.after) {
      setPaginationTokens({
        before: null,
        after: salesData.pagination.after,
      });
    }
  }, [salesData?.pagination?.after]);

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
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
              beforeToken={salesData?.pagination?.before}
              afterToken={salesData?.pagination?.after}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isLoading={salesLoading || isFetching}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © 2025 All rights reserved.
        </div>
      </footer>
    </div>
  );
}

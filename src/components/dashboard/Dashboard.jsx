"use client";

import { useState, useEffect, useCallback } from "react";
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
  minPrice: "",
  customerEmail: "",
  phone: "",
};

const initialSort = {
  sortBy: "",
  order: "",
};

export default function Dashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [paginationTokens, setPaginationTokens] = useState({
    before: null,
    after: null,
  });

  const { checkAndAuthorize, isLoading: authLoading } = useAuthorization();

  const salesQueryParams = {
    ...filters,
    ...sortConfig,
    ...paginationTokens,
    limit: 50,
  };

  Object.keys(salesQueryParams).forEach((key) => {
    if (
      salesQueryParams[key] === "" ||
      salesQueryParams[key] === null ||
      salesQueryParams[key] === undefined
    ) {
      delete salesQueryParams[key];
    }
  });

  const {
    data: salesData,
    isLoading: salesLoading,
    isFetching,
    refetch,
  } = useSales(salesQueryParams);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAndAuthorize();
        setIsAuthorized(true);
      } catch (error) {
        console.error("Authorization failed:", error);
      }
    };
    initAuth();
  }, []);

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
    if (salesData?.before) {
      setPaginationTokens({
        before: salesData.before,
        after: null,
      });
    }
  }, [salesData?.before]);

  const handleNext = useCallback(() => {
    if (salesData?.after) {
      setPaginationTokens({
        before: null,
        after: salesData.after,
      });
    }
  }, [salesData?.after]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-muted-foreground">Authorizing...</p>
        </div>
      </div>
    );
  }

  const salesItems = salesData?.data || salesData?.items || salesData || [];
  const isDataArray = Array.isArray(salesItems);
  const displayData = isDataArray ? salesItems : [];

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
                AutoBizz Sales Dashboard
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

          <StatsCards data={displayData} />

          <SalesChart data={displayData} isLoading={salesLoading && !isFetching} />

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
              data={displayData}
              isLoading={salesLoading}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
            <Pagination
              beforeToken={salesData?.before}
              afterToken={salesData?.after}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isLoading={salesLoading || isFetching}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © 2025 AutoBizz. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

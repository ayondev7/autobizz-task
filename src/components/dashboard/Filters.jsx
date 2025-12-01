"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FiSearch, FiX } from "react-icons/fi";

export default function Filters({ filters, onFilterChange, onClearFilters }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== undefined && value !== null
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full sm:w-auto">
          <Input
            label="Start Date"
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Input
            label="End Date"
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Input
            label="Minimum Price"
            type="number"
            placeholder="0.00"
            value={filters.minPrice || ""}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[200px]">
          <Input
            label="Customer Email"
            type="email"
            placeholder="customer@email.com"
            value={filters.customerEmail || ""}
            onChange={(e) => handleChange("customerEmail", e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1234567890"
            value={filters.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters} className="gap-2">
            <FiX className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

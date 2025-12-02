"use client";

import Button from "@/components/ui/Button";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  isLoading,
}) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious || isLoading}
        className="gap-2"
      >
        <FiChevronLeft className="w-4 h-4" />
        Previous
      </Button>
      <Button
        variant="outline"
        onClick={onNext}
        disabled={!canGoNext || isLoading}
        className="gap-2"
      >
        Next
        <FiChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

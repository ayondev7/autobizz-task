"use client";

import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function SalesTable({ data = [], isLoading, sortConfig, onSort }) {
  const handleSort = (field) => {
    let newOrder = "asc";
    if (sortConfig.sortBy === field && sortConfig.sortOrder === "asc") {
      newOrder = "desc";
    }
    onSort({ sortBy: field, sortOrder: newOrder });
  };

  const SortIcon = ({ field }) => {
    if (sortConfig.sortBy !== field) {
      return (
        <span className="ml-1 text-muted-foreground/50">
          <FiArrowUp className="w-3 h-3" />
        </span>
      );
    }
    return sortConfig.sortOrder === "asc" ? (
      <FiArrowUp className="ml-1 w-3 h-3 text-primary" />
    ) : (
      <FiArrowDown className="ml-1 w-3 h-3 text-primary" />
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No sales records found</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                onClick={() => handleSort("date")}
                className="cursor-pointer hover:text-foreground select-none"
              >
                <span className="flex items-center">
                  Date
                  <SortIcon field="date" />
                </span>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead
                onClick={() => handleSort("price")}
                className="cursor-pointer hover:text-foreground select-none"
              >
                <span className="flex items-center">
                  Price
                  <SortIcon field="price" />
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((sale) => (
              <TableRow key={sale._id}>
                <TableCell>{formatDate(sale.date)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {sale.customerEmail}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {sale.customerPhone}
                </TableCell>
                <TableCell className="font-semibold text-green-600">
                  {formatCurrency(sale.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

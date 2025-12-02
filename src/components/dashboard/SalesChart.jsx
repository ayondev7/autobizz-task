"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

// Aggregate data by week or month
function aggregateData(data, period = "week") {
  if (!data.length) return [];

  const aggregated = {};

  data.forEach((item) => {
    const date = new Date(item.day);
    let key;
    let label;

    if (period === "month") {
      key = `${date.getFullYear()}-${date.getMonth()}`;
      label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
    } else {
      // Week aggregation
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day;
      startOfWeek.setDate(diff);
      key = startOfWeek.toISOString().split("T")[0];
      label = startOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    if (!aggregated[key]) {
      aggregated[key] = {
        date: label,
        totalSales: 0,
        count: 0,
        sortKey: key,
      };
    }
    aggregated[key].totalSales += parseFloat(item.totalSale) || 0;
    aggregated[key].count += 1;
  });

  return Object.values(aggregated)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ date, totalSales }) => ({
      date,
      totalSales: Math.round(totalSales * 100) / 100,
    }));
}

export default function SalesChart({ data = [], isLoading }) {
  const [viewMode, setViewMode] = useState("month"); 

  const chartData =
    viewMode === "day"
      ? data
          .map((item) => ({
            date: new Date(item.day).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            totalSales: parseFloat(item.totalSale) || 0,
            fullDate: item.day,
          }))
          .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
      : aggregateData(data, viewMode);

  const sortedData = chartData;

  if (isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <Spinner size="lg" />
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No sales data available</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales Over Time</CardTitle>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "day", label: "Day" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setViewMode(option.value)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sortedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                interval={viewMode === "day" ? "preserveStartEnd" : 0}
                angle={sortedData.length > 12 ? -45 : 0}
                textAnchor={sortedData.length > 12 ? "end" : "middle"}
                height={sortedData.length > 12 ? 60 : 30}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value) => [
                  `$${value.toLocaleString()}`,
                  viewMode === "day" ? "Daily Sales" : viewMode === "week" ? "Weekly Sales" : "Monthly Sales",
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="totalSales"
                name="Total Sales"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#salesGradient)"
                dot={sortedData.length <= 31}
                activeDot={{ r: 6, fill: "hsl(var(--chart-1))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

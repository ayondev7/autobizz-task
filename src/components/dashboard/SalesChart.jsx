"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

export default function SalesChart({ data = [], isLoading }) {
  const chartData = data.map((item) => ({
    date: new Date(item.day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    totalSales: parseFloat(item.totalSale) || 0,
    fullDate: item.day,
  }));

  const sortedData = [...chartData].sort(
    (a, b) => new Date(a.fullDate) - new Date(b.fullDate)
  );

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
      <CardHeader>
        <CardTitle>Sales Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
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
                formatter={(value) => [`$${value.toLocaleString()}`, "Total Sales"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalSales"
                name="Total Sales"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--chart-1))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

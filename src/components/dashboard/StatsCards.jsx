"use client";

import Card, { CardContent } from "@/components/ui/Card";
import { FiDollarSign, FiTrendingUp, FiShoppingCart, FiUsers } from "react-icons/fi";

export default function StatsCards({ data = [] }) {
  const totalSales = data.reduce(
    (sum, item) => sum + (parseFloat(item.totalSales) || 0),
    0
  );

  const avgSale = data.length > 0 ? totalSales / data.length : 0;

  const uniqueCustomers = new Set(data.map((item) => item.customerEmail)).size;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalSales),
      icon: FiDollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Orders",
      value: data.length.toString(),
      icon: FiShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Average Sale",
      value: formatCurrency(avgSale),
      icon: FiTrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Unique Customers",
      value: uniqueCustomers.toString(),
      icon: FiUsers,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-4">
          <CardContent className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

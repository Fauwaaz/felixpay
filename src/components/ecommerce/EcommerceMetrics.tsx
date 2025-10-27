"use client";

import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "@/icons";
import Loading from "@/app/loading";

interface MetricBlock {
  total: number;
  growth: number;
}

interface Metrics {
  customers: MetricBlock;
  transactions: MetricBlock;
  payin: MetricBlock;
  payout: MetricBlock;
}

export const EcommerceMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/metrics");
        const data = await res.json();
        if (data.success) setMetrics(data.data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!metrics) {
    return <div className="p-4 text-red-500">Failed to load metrics</div>;
  }

  const getGrowthBadge = (value: number) => {
    if (value > 0)
      return (
        <Badge color="success">
          <ArrowUpIcon className="mr-1" />
          {value.toFixed(2)}%
        </Badge>
      );
    if (value < 0)
      return (
        <Badge color="error">
          <ArrowDownIcon className="mr-1" />
          {value.toFixed(2)}%
        </Badge>
      );
    return <Badge color="warning">0%</Badge>;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {/* Customers */}
      <MetricCard
        title="Customers"
        value={metrics.customers.total}
        color="border-t-green-600"
        icon={<GroupIcon className="size-6 text-gray-800 dark:text-white/90" />}
        growth={metrics.customers.growth}
        badge={getGrowthBadge(metrics.customers.growth)}
      />

      {/* Transactions */}
      <MetricCard
        title="Transactions"
        value={metrics.transactions.total}
        color="border-t-blue-600"
        icon={<BoxIconLine className="size-6 text-gray-800 dark:text-white/90" />}
        growth={metrics.transactions.growth}
        badge={getGrowthBadge(metrics.transactions.growth)}
      />

      {/* Total Payin */}
      <MetricCard
        title="Total Payin"
        value={`₹${metrics.payin.total.toLocaleString()}`}
        color="border-t-green-500"
        icon={<span className="text-xl">💰</span>}
        growth={metrics.payin.growth}
        badge={getGrowthBadge(metrics.payin.growth)}
      />

      {/* Total Payout */}
      <MetricCard
        title="Total Payout"
        value={`₹${metrics.payout.total.toLocaleString()}`}
        color="border-t-red-500"
        icon={<span className="text-xl">💵</span>}
        growth={metrics.payout.growth}
        badge={getGrowthBadge(metrics.payout.growth)}
      />
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  icon,
  color,
  badge,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  badge: React.ReactNode;
  growth?: number;
}) => (
  <div
    className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] border-t-4 ${color}`}
  >
    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
      {icon}
    </div>
    <div className="flex items-end justify-between mt-5">
      <div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {value}
        </h4>
      </div>
      {badge}
    </div>
  </div>
);
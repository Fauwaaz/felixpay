"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface Transaction {
  id: number;
  created_at: string;
  orderid: string;
  transaction_id: string;
  pay_type: string;
  money: number;
  real_money: number | null;
  utr: string | null;
  status: number;
  type: string;
  attach?: string | null;
}

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, statusFilter, search, dateFrom, dateTo]);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter) params.append("type", typeFilter);
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);

      const res = await fetch(`/api/transactions/list?${params.toString()}`);
      const data = await res.json();
      if (data.success) setTransactions(data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge color="warning">Pending</Badge>;
      case 1:
        return <Badge color="success">Success</Badge>;
      case 2:
        return <Badge color="error">Failed</Badge>;
      default:
        return <Badge color="error">Unknown</Badge>;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      {/* 🔍 Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search Order ID / Txn ID / UTR"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-transparent dark:text-white"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-transparent dark:text-white"
        >
          <option value="">All Types</option>
          <option value="payin">Payin</option>
          <option value="payout">Payout</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-transparent dark:text-white"
        >
          <option value="">All Status</option>
          <option value="0">Pending</option>
          <option value="1">Success</option>
          <option value="2">Failed</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-transparent dark:text-white"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-transparent dark:text-white"
        />
        <button
          onClick={fetchTransactions}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setTypeFilter("");
            setStatusFilter("");
            setSearch("");
            setDateFrom("");
            setDateTo("");
          }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
        >
          Reset
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1100px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "Date",
                  "System Order Id",
                  "Order Id",
                  "Transaction Id",
                  "Phone",
                  "Pay Type",
                  "Amount",
                  "Real Amount",
                  "UTR",
                  "Status",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y text-sm divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  {React.createElement((TableCell as any), { colSpan: 10, className: "text-center py-6" }, (
                      <div className="flex justify-center items-center w-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#465fff] mx-auto mb-4"></div>
                      </div>
                  ))}
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  {React.createElement((TableCell as any), { colSpan: 10, className: "text-center py-6 text-gray-400" }, "No transactions found")}
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="px-4 py-3 text-gray-600">
                      {new Date(tx.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">{tx.id}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">{tx.orderid}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">{tx.transaction_id}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">{tx.attach || "-"}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">{tx.type}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">₹{tx.money}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">
                      {tx.real_money ? `₹${tx.real_money.toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">{tx.utr || "-"}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">{getStatusBadge(tx.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
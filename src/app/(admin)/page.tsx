
import type { Metadata } from "next";
import React from "react";
import Dashboard from "@/components/dashboard/DashboardPage";

export const metadata: Metadata = {
  title:
    "Dashboard | Felix Pay",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
  icons: "/favicon.ico"
};

export default function Ecommerce() {
    return (
      <Dashboard />
  );
}

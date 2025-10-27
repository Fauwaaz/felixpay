import TransactionsTable from "@/components/tables/TransactionsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transactions > FelixPay",
    description: "View and manage your transactions on FelixPay.",
};
export default function page() {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
            <TransactionsTable />
        </div>
    );
}
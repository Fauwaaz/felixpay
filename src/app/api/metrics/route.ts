import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function GET() {
  try {
    const db = await createConnection("");

    // ---- Current month date range ----
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    const currentMonth = currentMonthStart.toISOString().split("T")[0];

    const lastMonthStart = new Date(currentMonthStart);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    const lastMonth = lastMonthStart.toISOString().split("T")[0];

    // Customers (total + growth)
    const [currentUsers] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE DATE(created_at) >= ?",
      [currentMonth]
    );
    const [lastUsers] = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE DATE(created_at) >= ? AND DATE(created_at) < ?",
      [lastMonth, currentMonth]
    );
    const [totalUsers] = await db.query("SELECT COUNT(*) AS total FROM users");

    // Transactions (total + growth)
    const [currentTx] = await db.query(
      "SELECT COUNT(*) AS total FROM fp_transactions WHERE DATE(created_at) >= ?",
      [currentMonth]
    );
    const [lastTx] = await db.query(
      "SELECT COUNT(*) AS total FROM fp_transactions WHERE DATE(created_at) >= ? AND DATE(created_at) < ?",
      [lastMonth, currentMonth]
    );
    const [totalTx] = await db.query("SELECT COUNT(*) AS total FROM fp_transactions");

    // Payin totals
    const [payinCurrent] = await db.query(
      "SELECT IFNULL(SUM(money),0) AS total FROM fp_transactions WHERE type='payin' AND DATE(created_at) >= ?",
      [currentMonth]
    );
    const [payinLast] = await db.query(
      "SELECT IFNULL(SUM(money),0) AS total FROM fp_transactions WHERE type='payin' AND DATE(created_at) >= ? AND DATE(created_at) < ?",
      [lastMonth, currentMonth]
    );
    const [totalPayin] = await db.query(
      "SELECT IFNULL(SUM(money),0) AS total FROM fp_transactions WHERE type='payin'"
    );

    // Payout totals
    const [payoutCurrent] = await db.query(
      "SELECT IFNULL(SUM(money),0) AS total FROM fp_transactions WHERE type='payout' AND DATE(created_at) >= ?",
      [currentMonth]
    );
    const [payoutLast] = await db.query(
      "SELECT IFNULL(SUM(money),0) AS total FROM fp_transactions WHERE type='payout' AND DATE(created_at) >= ? AND DATE(created_at) < ?",
      [lastMonth, currentMonth]
    );
    const [totalPayout] = await db.query(
      "SELECT IFNULL(SUM(money),0) AS total FROM fp_transactions WHERE type='payout'"
    );

    await db.end();

    const growth = (current: number, last: number) => {
      if (last === 0 && current > 0) return 100;
      if (last === 0 && current === 0) return 0;
      return ((current - last) / last) * 100;
    };

    return NextResponse.json({
      success: true,
      data: {
        customers: {
          total: totalUsers[0].total,
          growth: growth(currentUsers[0].total, lastUsers[0].total),
        },
        transactions: {
          total: totalTx[0].total,
          growth: growth(currentTx[0].total, lastTx[0].total),
        },
        payin: {
          total: totalPayin[0].total,
          growth: growth(payinCurrent[0].total, payinLast[0].total),
        },
        payout: {
          total: totalPayout[0].total,
          growth: growth(payoutCurrent[0].total, payoutLast[0].total),
        },
      },
    });
  } catch (error) {
    console.error("Metrics API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
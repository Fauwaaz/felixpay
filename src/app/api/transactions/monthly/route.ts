import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function GET() {
  try {
    const db = await createConnection("");

    // Query monthly totals for Payin and Payout
    const [rows] = await db.query(`
      SELECT 
        MONTH(created_at) AS month,
        SUM(CASE WHEN type = 'payin' THEN money ELSE 0 END) AS total_payin,
        SUM(CASE WHEN type = 'payout' THEN money ELSE 0 END) AS total_payout
      FROM fp_transactions
      WHERE YEAR(created_at) = YEAR(CURDATE())
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at)
    `);

    await db.end();

    // Prepare monthly data for all 12 months
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const payinData = months.map(
      (m) => rows.find((r: any) => r.month === m)?.total_payin || 0
    );
    const payoutData = months.map(
      (m) => rows.find((r: any) => r.month === m)?.total_payout || 0
    );

    return NextResponse.json({
      success: true,
      data: { payin: payinData, payout: payoutData },
    });
  } catch (error) {
    console.error("Monthly transactions API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
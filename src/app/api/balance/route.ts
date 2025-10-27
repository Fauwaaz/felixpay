import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { verifySign } from "@/lib/signature";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.mid || !data.sign)
      return NextResponse.json({ code: 1, message: "mid, sign required" });

    const db = await createConnection('');
    const [merchantRows] = await db.query("SELECT id, private_key FROM users WHERE id = ?", [data.mid]);
    if (!merchantRows.length) return NextResponse.json({ code: 2, message: "Invalid merchant" });

    const merchant = merchantRows[0];
    if (!verifySign(data, merchant.private_key)) return NextResponse.json({ code: 5, message: "Invalid signature" });

    const [balances] = await db.query(`
      SELECT 
        SUM(CASE WHEN type='payin' THEN money ELSE 0 END) AS payin,
        SUM(CASE WHEN type='payout' THEN money ELSE 0 END) AS payout,
        (SUM(CASE WHEN type='payin' THEN money ELSE 0 END) - 
         SUM(CASE WHEN type='payout' THEN money ELSE 0 END)) AS balance
      FROM transactions WHERE merchant_id = ?`, [merchant.id]);

    await db.end();
    return NextResponse.json({ code: 0, status: "success", data: balances[0] });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: 500, message: "Internal Server Error" });
  }
}
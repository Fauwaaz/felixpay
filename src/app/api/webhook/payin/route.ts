import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { verifySign } from "@/lib/signature";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const db = await createConnection('');

    const [merchantRows] = await db.query("SELECT id, private_key FROM users WHERE id = ?", [data.mid]);
    if (!merchantRows.length) return NextResponse.json("fail");

    const merchant = merchantRows[0];
    if (!verifySign(data, merchant.private_key)) return NextResponse.json("fail");

    const [rows] = await db.query("SELECT id FROM transactions WHERE orderid = ?", [data.out_trade_no || data.orderid]);
    if (!rows.length) return NextResponse.json("fail");

    await db.query(
      "UPDATE transactions SET status = ?, utr = ?, updated_at = NOW() WHERE orderid = ?",
      [data.status, data.utr || null, data.out_trade_no || data.orderid]
    );

    await db.end();
    return new Response("success");

  } catch (error) {
    console.error(error);
    return new Response("fail");
  }
}
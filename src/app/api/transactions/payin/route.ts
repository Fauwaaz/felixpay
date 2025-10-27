import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      merchant_id,
      orderid,
      amount,
      currency,
      notify_url,
      return_url,
      pay_type,
      attach
    } = body;

    if (!merchant_id || !orderid || !amount) {
      return NextResponse.json(
        { success: false, message: "merchant_id, orderid, and amount are required" },
        { status: 400 }
      );
    }

    const db = await createConnection('');

    // Check merchant exists
    const [merchantCheck] = await db.query(
      "SELECT id FROM merchants WHERE id = ?",
      [merchant_id]
    );
    if (merchantCheck.length === 0) {
      await db.end();
      return NextResponse.json(
        { success: false, message: "Invalid merchant_id" },
        { status: 400 }
      );
    }

    // Insert transaction
    const sql = `
      INSERT INTO fp_transactions
      (merchant_id, orderid, transaction_id, type, pay_type, currency, money, status, attach, notify_url, return_url, created_at)
      VALUES (?, ?, ?, 'payin', ?, ?, ?, 0, ?, ?, ?, NOW())
    `;
    const transactionId = `FP${Date.now()}${Math.floor(Math.random() * 10000)}`;

    const [result] = await db.query(sql, [
      merchant_id,
      orderid,
      transactionId,
      pay_type || "upi",
      currency || "INR",
      amount,
      attach || "",
      notify_url || null,
      return_url || null
    ]);

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Payin transaction created",
      data: {
        id: result.insertId,
        transaction_id: transactionId,
        orderid,
        merchant_id,
        amount,
        currency: currency || "INR"
      }
    });
  } catch (error) {
    console.error("Payin API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
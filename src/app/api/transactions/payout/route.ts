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
      account,
      beneficiary_name,
      ifsc,
      attach
    } = body;

    if (!merchant_id || !orderid || !amount || !account || !beneficiary_name) {
      return NextResponse.json(
        { success: false, message: "merchant_id, orderid, amount, account, and beneficiary_name are required" },
        { status: 400 }
      );
    }

    const db = await createConnection('');

    // Verify merchant
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

    // Insert payout transaction
    const sql = `
      INSERT INTO fp_transactions
      (merchant_id, orderid, transaction_id, type, currency, money, status, account, beneficiary_name, ifsc, attach, created_at)
      VALUES (?, ?, ?, 'payout', ?, ?, 0, ?, ?, ?, ?, NOW())
    `;
    const transactionId = `FP${Date.now()}${Math.floor(Math.random() * 10000)}`;

    const [result] = await db.query(sql, [
      merchant_id,
      orderid,
      transactionId,
      currency || "INR",
      amount,
      account,
      beneficiary_name,
      ifsc || "",
      attach || ""
    ]);

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Payout transaction created",
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
    console.error("Payout API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
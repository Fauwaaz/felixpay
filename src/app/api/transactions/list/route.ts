import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    const db = await createConnection('');
    let sql = "SELECT * FROM fp_transactions WHERE 1=1";
    const params: any[] = [];

    if (type) {
      sql += " AND type = ?";
      params.push(type);
    }

    if (status) {
      sql += " AND status = ?";
      params.push(status);
    }

    if (search) {
      sql += " AND (orderid LIKE ? OR transaction_id LIKE ? OR utr LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (from) {
      sql += " AND DATE(created_at) >= ?";
      params.push(from);
    }

    if (to) {
      sql += " AND DATE(created_at) <= ?";
      params.push(to);
    }

    sql += " ORDER BY id DESC LIMIT 200";
    const [rows] = await db.query(sql, params);
    await db.end();

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("List API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
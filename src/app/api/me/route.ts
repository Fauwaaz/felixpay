import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createConnection } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    const db = await createConnection("");
    const [rows] = await db.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [decoded.userId]);
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user: rows[0] });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
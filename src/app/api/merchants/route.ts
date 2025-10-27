import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await createConnection('');
  const [rows] = await db.query("SELECT * FROM merchants ORDER BY id DESC");
  await db.end();
  return NextResponse.json(rows);
}
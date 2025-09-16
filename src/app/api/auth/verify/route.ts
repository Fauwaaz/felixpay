
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createConnection } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const db = await createConnection('');
    
    // Get current user data
    const sql = "SELECT id, name, email, created_at FROM users WHERE id = ?";
    const userId = typeof decoded === "object" && decoded !== null && "userId" in decoded ? (decoded as any).userId : undefined;
    if (!userId) {
      await db.end();
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }
    const [users] = await db.query(sql, [userId]);
    
    await db.end();

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: users[0]
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}
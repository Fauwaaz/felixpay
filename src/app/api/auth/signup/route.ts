import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const db = await createConnection('');

    // Check if user already exists
    const checkSql = "SELECT id FROM users WHERE email = ?";
    const [existingUsers] = await db.query(checkSql, [email]);

    if (existingUsers.length > 0) {
      await db.end();
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const insertSql = `
      INSERT INTO users (name, email, password, created_at) 
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await db.query(insertSql, [name, email, hashedPassword]);
    // Create merchant entry for this user
    const newUserId = result.insertId;
    const generatedPrivateKey = `fp_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    await db.query(
      "INSERT INTO merchants (user_id, name, email, private_key) VALUES (?, ?, ?, ?)",
      [newUserId, name, email, generatedPrivateKey]
    );


    // Generate JWT token
    const token = jwt.sign(
      {
        userId: result.insertId,
        email: email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    await db.end();

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: result.insertId,
        name,
        email,
        created_at: new Date().toISOString()
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


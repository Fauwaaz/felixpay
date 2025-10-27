import mysql from 'mysql2/promise';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'sg1-cl8-ats1.a2hosting.com',
      user: process.env.MYSQL_USER || 'yxcuzrhp_fauwaaz',
      password: process.env.MYSQL_PASSWORD || 'fauwaazspark',
      database: process.env.MYSQL_DATABASE || 'yxcuzrhp_felixpay',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      connectTimeout: 60000,
    });
 
    await conn.end();

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful!',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      error_code: error.code,
      error_errno: error.errno,
      message: 'Failed to connect to database'
    }, { status: 500 });
  }
}

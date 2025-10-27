import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function GET() {
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

  } catch (error) {
    console.error('Database connection error:', error);
    
    const errMessage = error instanceof Error ? error.message : String(error);
    const errAny = error as any;
    const errCode = typeof errAny?.code !== 'undefined' ? errAny.code : null;
    const errErrno = typeof errAny?.errno !== 'undefined' ? errAny.errno : null;
    
    return NextResponse.json({ 
      success: false, 
      error: errMessage,
      error_code: errCode,
      error_errno: errErrno,
      message: 'Failed to connect to database'
    }, { status: 500 });
  }
}

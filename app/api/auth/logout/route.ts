import { NextRequest, NextResponse } from 'next/server';
import { clearAdminSession } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  await clearAdminSession();
  const host = request.headers.get('host') || 'cedrik.me';
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
  return NextResponse.redirect(`${protocol}://${host}/admin/short`);
}

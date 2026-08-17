import { NextResponse } from 'next/server';
import { getAdminSession } from '@/app/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({
    authenticated: Boolean(session),
    user: session || null,
  });
}

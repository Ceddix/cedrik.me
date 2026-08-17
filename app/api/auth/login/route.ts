import { NextRequest, NextResponse } from 'next/server';
import { setAdminSession } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const secret = body.secret || '';

    const adminSecret = process.env.ADMIN_SECRET || '';

    if (!adminSecret) {
      return NextResponse.json(
        { success: false, error: 'ADMIN_SECRET environment variable is not configured on the server' },
        { status: 500 }
      );
    }

    if (secret && secret === adminSecret) {
      await setAdminSession({
        id: 'admin',
        username: 'Cedrik',
        global_name: 'Cedrik',
        authenticatedAt: Date.now(),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid secret key' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 });
  }
}

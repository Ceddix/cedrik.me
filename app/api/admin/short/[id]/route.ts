import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/app/lib/db';
import { isRequestAuthorized } from '@/app/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isRequestAuthorized(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const linkId = parseInt(id, 10);
  if (isNaN(linkId)) {
    return NextResponse.json({ error: 'Invalid link ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    let { target, alias } = body;

    if (!target || typeof target !== 'string') {
      return NextResponse.json({ error: 'Target URL is required.' }, { status: 400 });
    }

    target = target.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }

    try {
      new URL(target);
    } catch {
      return NextResponse.json({ error: 'Invalid Target URL format.' }, { status: 400 });
    }

    if (!alias || typeof alias !== 'string' || !alias.trim()) {
      return NextResponse.json({ error: 'Alias is required.' }, { status: 400 });
    }

    alias = alias
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\-_/]/g, '-');

    const sql = getDb();

    // Check alias conflict with other links
    const duplicate = await sql`SELECT id FROM links WHERE alias = ${alias} AND id != ${linkId} LIMIT 1`;
    if (duplicate && duplicate.length > 0) {
      return NextResponse.json({ error: `Alias '${alias}' is already in use.` }, { status: 409 });
    }

    const updated = await sql`
      UPDATE links
      SET target = ${target}, alias = ${alias}
      WHERE id = ${linkId}
      RETURNING *
    `;

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, link: updated[0] });
  } catch (err: any) {
    console.error('Error updating link:', err);
    return NextResponse.json({ error: 'Failed to update link', details: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isRequestAuthorized(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const linkId = parseInt(id, 10);
  if (isNaN(linkId)) {
    return NextResponse.json({ error: 'Invalid link ID' }, { status: 400 });
  }

  try {
    const sql = getDb();
    await sql`DELETE FROM links WHERE id = ${linkId}`;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting link:', err);
    return NextResponse.json({ error: 'Failed to delete link', details: err.message }, { status: 500 });
  }
}

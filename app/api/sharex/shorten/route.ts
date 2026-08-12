import { NextRequest, NextResponse } from 'next/server';
import { getDb, initLinksTable } from '@/app/lib/db';
import { isRequestAuthorized } from '@/app/lib/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  if (!process.env.ADMIN_SECRET) {
    return NextResponse.json({ status: 'error', message: 'ADMIN_SECRET environment variable is not configured on the server' }, { status: 500 });
  }

  const isAuth = await isRequestAuthorized(request);
  if (!isAuth) {
    return NextResponse.json({ status: 'error', message: 'Unauthorized ShareX API key' }, { status: 401 });
  }

  try {
    await initLinksTable();

    let target = '';
    let alias = '';

    const contentType = request.headers.get('content-type') || '';
    const bodyText = await request.text();

    if (contentType.includes('application/json') || bodyText.trim().startsWith('{')) {
      try {
        const body = JSON.parse(bodyText);
        target = body.url || body.target || body.URL || '';
        alias = body.alias || body.slug || body.name || '';
      } catch {}
    }

    if (!target) {
      const params = new URLSearchParams(bodyText);
      target = params.get('url') || params.get('target') || params.get('URL') || '';
      alias = alias || params.get('alias') || params.get('slug') || params.get('name') || '';
    }

    // Direct string fallback
    if (!target && bodyText && !bodyText.includes('=')) {
      target = bodyText.trim();
    }

    if (!target) {
      target = request.nextUrl.searchParams.get('url') || request.nextUrl.searchParams.get('target') || '';
    }
    if (!alias) {
      alias = request.nextUrl.searchParams.get('alias') || request.nextUrl.searchParams.get('slug') || '';
    }

    if (!target) {
      return NextResponse.json({ status: 'error', message: 'No target URL provided' }, { status: 400 });
    }

    target = target.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }

    try {
      new URL(target);
    } catch {
      return NextResponse.json({ status: 'error', message: 'Invalid URL format' }, { status: 400 });
    }

    // Sanitize alias - if literal prompt text or unparsed syntax passed, clear it
    if (alias && (alias.toLowerCase().includes('prompt') || alias.startsWith('{') || alias.startsWith('$'))) {
      alias = '';
    }

    if (!alias || !alias.trim()) {
      alias = crypto.randomBytes(3).toString('hex');
    } else {
      alias = alias
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\-_/]/g, '-');
    }

    const sql = getDb();

    // If custom alias specified and already exists, generate a random suffix
    const existing = await sql`SELECT id FROM links WHERE alias = ${alias} LIMIT 1`;
    if (existing && existing.length > 0) {
      alias = `${alias}-${crypto.randomBytes(2).toString('hex')}`;
    }

    await sql`
      INSERT INTO links (alias, target, visit_count)
      VALUES (${alias}, ${target}, 0)
    `;

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'cedrik.me';
    const protoHeader = request.headers.get('x-forwarded-proto');
    const protocol = protoHeader || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
    const origin = `${protocol}://${host}`;
    const shortUrl = `${origin}/s/${alias}`;

    return NextResponse.json({
      status: 'success',
      short_url: shortUrl,
      url: shortUrl,
      alias: alias,
      target: target,
    });
  } catch (err: any) {
    console.error('ShareX Shorten API Error:', err);
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

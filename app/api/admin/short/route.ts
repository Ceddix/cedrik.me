import { NextRequest, NextResponse } from 'next/server';
import { getDb, initLinksTable } from '@/app/lib/db';
import { isRequestAuthorized } from '@/app/lib/auth';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const isAuth = await isRequestAuthorized(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initLinksTable();
    const sql = getDb();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));
    const query = (searchParams.get('q') || '').trim();
    const offset = (page - 1) * limit;

    // Overall stats
    const totalCountRes = await sql`SELECT COUNT(*)::int as count FROM links`;
    const totalClicksRes = await sql`SELECT COALESCE(SUM(visit_count), 0)::int as total_clicks FROM links`;
    const topLinkRes = await sql`SELECT alias, visit_count FROM links ORDER BY visit_count DESC LIMIT 1`;

    const totalLinks = totalCountRes[0]?.count || 0;
    const totalClicks = totalClicksRes[0]?.total_clicks || 0;
    const topLink = topLinkRes[0] || null;

    let rows;
    let filteredCount = totalLinks;

    if (query) {
      const searchPattern = `%${query}%`;
      const filteredRes = await sql`
        SELECT COUNT(*)::int as count FROM links 
        WHERE alias ILIKE ${searchPattern} OR target ILIKE ${searchPattern}
      `;
      filteredCount = filteredRes[0]?.count || 0;

      rows = await sql`
        SELECT * FROM links 
        WHERE alias ILIKE ${searchPattern} OR target ILIKE ${searchPattern}
        ORDER BY id DESC 
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      rows = await sql`
        SELECT * FROM links 
        ORDER BY id DESC 
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const totalPages = Math.max(1, Math.ceil(filteredCount / limit));

    return NextResponse.json({
      links: rows,
      pagination: {
        page,
        limit,
        totalLinks: filteredCount,
        totalPages,
      },
      stats: {
        totalLinks,
        totalClicks,
        topLink,
      },
    });
  } catch (err: any) {
    console.error('Error fetching links:', err);
    return NextResponse.json({ error: 'Failed to fetch links', details: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAuth = await isRequestAuthorized(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initLinksTable();
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

    // Process alias
    if (!alias || typeof alias !== 'string' || !alias.trim()) {
      alias = crypto.randomBytes(3).toString('hex'); // 6 character random hex slug
    } else {
      alias = alias
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\-_/]/g, '-');
    }

    const sql = getDb();

    // Check if alias already exists
    const existing = await sql`SELECT id FROM links WHERE alias = ${alias} LIMIT 1`;
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: `Alias '${alias}' already exists.` }, { status: 409 });
    }

    const inserted = await sql`
      INSERT INTO links (alias, target, visit_count)
      VALUES (${alias}, ${target}, 0)
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      link: inserted[0],
    });
  } catch (err: any) {
    console.error('Error creating short link:', err);
    return NextResponse.json({ error: 'Failed to create link', details: err.message }, { status: 500 });
  }
}

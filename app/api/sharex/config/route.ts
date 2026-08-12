import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'cedrik.me';
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
  const origin = `${protocol}://${host}`;

  const adminSecret = process.env.ADMIN_SECRET || '';
  const configName = `cedrik.me URL Shortener [${host.includes('localhost') ? 'Local' : 'Prod'}]`;

  const sxcuConfig = {
    Version: '15.0.0',
    Name: configName,
    DestinationType: 'URLShortener',
    RequestMethod: 'POST',
    RequestURL: `${origin}/api/sharex/shorten`,
    Headers: {
      Authorization: `Bearer ${adminSecret}`,
    },
    Body: 'FormUrlEncoded',
    Arguments: {
      url: '{input}',
      alias: '{prompt:Enter custom slug (leave blank for random)}',
    },
    URL: '{json:short_url}',
    ErrorMessage: '{json:message}',
  };

  const jsonStr = JSON.stringify(sxcuConfig, null, 2);
  const filename = 'cedrik.me-shortener.sxcu';

  return new NextResponse(jsonStr, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}

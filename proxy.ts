import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { neon } from '@neondatabase/serverless';

export const config = {
    matcher: ['/f(iles)?/(.*)', '/s(hort)?/(.*)'],
}

export async function proxy(request: NextRequest) {
    if (!request || !request.nextUrl) {
        return NextResponse.next();
    }

    const path = request.nextUrl.pathname;
    const segments = path.split('/');
    const baseUrl = request.url || "http://localhost:3000";

    // URL rewrite for ShareX uploads
    if (path.startsWith('/f/') || path.startsWith('/files/')) {
        const newPath = `https://craft-together-mc.de/~ceddix/uploads/${segments.slice(2).join('/')}`;
        const response = await fetch(new URL(newPath, baseUrl));

        if (response.status === 404) {
            return NextResponse.rewrite(new URL('/not-found', baseUrl))
        }

        return response;
    }

    // URL shortener with Vercel/Neon Postgres database
    if (path.startsWith('/s/') || path.startsWith('/short/')) {

        // Catch database connection or query errors during build-time execution
        try {

            const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
            const sql = neon(dbUrl);

            // Making a SQL query to select a link from the links table where the alias matches the provided slug
            // The result is limited to 1 row
            const rows =
                await sql`SELECT * FROM links WHERE alias=${segments.slice(2).join('/')} LIMIT 1`;

            // If no rows are returned, return a response indicating the slug is not in the record
            if (!rows || rows.length === 0) {
                return NextResponse.rewrite(new URL('/not-found', baseUrl))
            }

            // If a row is returned, increment the visit_count for the link with the provided slug
            if (rows[0]) {
                await sql`UPDATE links SET visit_count = visit_count + 1 WHERE alias = ${segments.slice(2).join('/')}`;
            }

            // Redirect to the target of the first row (the selected link)
            return NextResponse.redirect((rows[0] as Record<string, any>).target, 302);
        } catch {
            return NextResponse.rewrite(new URL('/not-found', baseUrl));
        }

    }
}
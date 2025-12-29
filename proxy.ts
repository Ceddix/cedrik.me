import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {sql} from '@vercel/postgres';

export const config = {
    matcher: ['/f(iles)?/(.*)','/s(hort)?/(.*)'],
}

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const segments = path.split('/');

    // URL rewrite for ShareX uploads
    if (path.startsWith('/f/') || path.startsWith('/files/')) {
        const newPath = `https://craft-together-mc.de/~ceddix/uploads/${segments.slice(2).join('/')}`;
        const response = await fetch(new URL(newPath, request.url));

        if (response.status === 404) {
            return NextResponse.rewrite(new URL('/not-found', request.url))
        }

        return response;
    }

    // URL shortener with Vercel database
    if (path.startsWith('/s/') || path.startsWith('/short/')) {
        // Making a SQL query to select a link from the links table where the alias matches the provided slug
        // The result is limited to 1 row
        const {rows} =
            await sql`SELECT * FROM links WHERE alias=${segments.slice(2).join('/')} LIMIT 1`;

        // If no rows are returned, return a response indicating the slug is not in the record
        if (rows.length === 0) {
            return NextResponse.rewrite(new URL('/not-found', request.url))
        }

        // If a row is returned, increment the visit_count for the link with the provided slug
        if (rows[0]) {
            await sql`UPDATE links SET visit_count = visit_count + 1 WHERE alias = ${segments.slice(2).join('/')}`;
        }

        // Redirect to the target of the first row (the selected link)
        return NextResponse.redirect(rows[0].target, 302);
    }

}
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
    matcher: ['/f(iles)?/(.*)'],
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // URL rewrite for ShareX uploads
    if (path.startsWith('/f/') || path.startsWith('/files/')) {
        const segments = path.split('/');
        const newPath = `https://craft-together-mc.de/~ceddix/uploads/${segments.slice(2).join('/')}`;
        const response = await fetch(new URL(newPath, request.url));

        if (response.status === 404) {
            return NextResponse.rewrite(new URL('/not-found', request.url))
        }

        return response;
    }

}
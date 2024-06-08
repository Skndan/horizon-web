import { NextRequest, NextResponse } from 'next/server';

const isExpired = (exp: number) => {
    if (exp === 0) {
        return false;
    }


    return Math.floor(Date.now() / 1000) < exp;
};


export function middleware(req: NextRequest) {

    const token = req.cookies.get('nextauth.token')?.value;
    const exp = req.cookies.get('nextauth.exp')?.value;

    const { pathname } = req.nextUrl;

    // Exclude specific paths from the redirect logic to prevent loops
    if (pathname === '/' || pathname.startsWith('/_next') || pathname.match('.svg') || pathname.match('.ico') || pathname.startsWith('/auth/reset')) {
        return NextResponse.next();
    }

    const verifiedToken = token && isExpired(parseInt(exp ?? '0'));

;

    if (!verifiedToken) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
} 
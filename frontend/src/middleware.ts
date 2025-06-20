import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/vibe(.*)']);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect()

    const mostRecentServer = req.cookies.get("mostRecentServer");
    const mostRecentChannel = req.cookies.get("mostRecentChannel");
    console.log("AAA", mostRecentChannel, mostRecentServer);
    if (mostRecentServer) {
        if (mostRecentChannel) {
            return NextResponse.redirect(`/vibe/${mostRecentServer}/channel/${mostRecentChannel}`);
        }
        return NextResponse.redirect(`/vibe/${mostRecentServer}`);
    }
})

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Check if this is the settings page
  if (path === '/global-settings') {
    // Get the current mode from cookies
    const enforceRoles = request.cookies.get('enforceRoles')?.value === 'true';
    const isParentMode = request.cookies.get('isParentMode')?.value === 'true';

    // If roles are enforced and not in parent mode, redirect to home
    if (enforceRoles && !isParentMode) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Configure the paths that should be handled by this middleware
export const config = {
  matcher: ['/global-settings'],
};

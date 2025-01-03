import { NextResponse } from "next/server";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE, isSupportLocale } from "@/international/config"
import Negotiator from "negotiator";

const getLocale = (request)=>{
    const headers = {
        "accept-language": request.headers.get("accept-language") ?? "",
      }
      return new Negotiator({ headers }).language(SUPPORTED_LOCALES) ?? DEFAULT_LOCALE
}

export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}
import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export default NextAuth(authConfig).auth

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}

import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const ContentSecurityPolicy = `
    default-src 'self' *.googleapis.com *.gstatic.com;
    img-src 'self' *.googleapis.com *.gstatic.com data:;
    script-src 'self'  *.gstatic.com 'unsafe-eval' 'unsafe-inline';
    script-src-elem 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com *.gstatic.com;
    child-src *.googleapis.com *.gstatic.com;
    connect-src 'self' *.googleapis.com *.gstatic.com;
    style-src 'self' *.googleapis.com *.gstatic.com;
    font-src 'self' *.googleapis.com *.gstatic.com;
    worker-src 'self' *.googleapis.com *.gstatic.com localhost;
  `

  const requestHeaders = new Headers(req.headers)
  // requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next()

  requestHeaders.set(
    'Content-Security-Policy',
    ContentSecurityPolicy.replace(/\n/g, '')
  )

  response.headers.set(
    'Content-Security-Policy',
    ContentSecurityPolicy.replace(/\n/g, '')
  )
  response.headers.set('X-Frame-Options', 'deny')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  response.headers.set('X-XSS-Protection', '1; mode=block')
  // response.headers.set(
  //   'Permissions-Policy',
  //   'camera=(self); battery=(); geolocation=(); microphone=()'
  // )

  return response
}

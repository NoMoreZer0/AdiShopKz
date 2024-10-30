import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decrypt } from "@/lib/session"

const protectedRoutes = ["/profile"]

export default async function middleware(req) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)

  const allCookies = await cookies();
  const cookie = allCookies.get("session")?.value
  const session = await decrypt(cookie)

  if (isProtectedRoute && session?.userId === null) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  return NextResponse.next()
}
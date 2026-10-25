import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) {
    return NextResponse.redirect(new URL("/payment-failed", req.url));
  }
  return NextResponse.redirect(new URL(`/payment-success?ref=${ref}`, req.url));
}




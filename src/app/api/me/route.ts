// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import Me from "@/lib/auth/me.server";

export async function GET() {
  try {
    const user = await Me();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

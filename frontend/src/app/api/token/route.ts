import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET() {
  try {
    const { token } = await auth0.getAccessToken({
      authorizationParams: {
        audience: process.env.AUTH0_AUDIENCE
      }
    });

    return NextResponse.json({ accessToken: token });
  } catch {
    return NextResponse.json({ accessToken: null }, { status: 401 });
  }
}

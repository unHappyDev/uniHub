import onErrorHandler from "@/lib/errors/handler";
import cacheControl from "@/lib/models/cache-control";
import cookieControl from "@/lib/models/cookie-control";
import login from "@/lib/models/login";
import validator from "@/lib/models/validator/validator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = validator.validateLogin(body);
    const newSession = await login.loginUser(email, password);

    const response = NextResponse.json(
      {
        id: newSession.id,
        created_at: newSession.created_at,
        updated_at: newSession.updated_at,
        expires_at: newSession.expires_at,
      },
      { status: 201 },
    );
    cacheControl.setNoCache(response);
    cookieControl.setSessionIdCookie(response, newSession.token);
    return response;
  } catch (error) {
    return onErrorHandler(error);
  }
}

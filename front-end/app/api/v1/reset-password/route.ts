import onErrorHandler from "@/lib/errors/handler";
import cacheControl from "@/lib/models/cache-control";
import { resetPassword } from "@/lib/models/reset-password";
import validator from "@/lib/models/validator/validator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = validator.validateResetPassword(body);
    await resetPassword(token, password);

    const response = NextResponse.json(
      {
        token,
      },
      { status: 201 },
    );
    cacheControl.setNoCache(response);
    return response;
  } catch (error) {
    return onErrorHandler(error);
  }
}

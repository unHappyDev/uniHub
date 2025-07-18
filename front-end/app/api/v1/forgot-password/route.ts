import onErrorHandler from "@/lib/errors/handler";
import cacheControl from "@/lib/models/cache-control";
import { forgotPassword } from "@/lib/models/reset-password";
import validator from "@/lib/models/validator/validator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = validator.validateForgotPassword(body);
    await forgotPassword(email);

    const response = NextResponse.json(
      {
        email,
      },
      { status: 201 },
    );
    cacheControl.setNoCache(response);
    return response;
  } catch (error) {
    return onErrorHandler(error);
  }
}

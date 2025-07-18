import { NextResponse } from "next/server";
import activation from "@/lib/models/activation";
import validator from "@/lib/models/validator/validator";
import cacheControl from "@/lib/models/cache-control";
import onErrorHandler from "@/lib/errors/handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token } = validator.validateResendActivation(body);
    if (email) {
      await activation.sendActivationEmailTo(email);
    } else if (token) {
      await activation.resendActivationToken(token);
    }

    const response = NextResponse.json(
      {
        email,
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

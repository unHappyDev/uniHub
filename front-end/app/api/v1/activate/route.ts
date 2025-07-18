import { NextResponse } from "next/server";
import validator from "@/lib/models/validator/validator";
import activate from "@/lib/models/activate";
import cacheControl from "@/lib/models/cache-control";
import onErrorHandler from "@/lib/errors/handler";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = validator.validateActivate(searchParams.get("token"));
    const activationToken = await activate.activateUserByToken(token);

    const response = NextResponse.json(
      {
        id: activationToken.id,
        expires_at: activationToken.expires_at,
        created_at: activationToken.created_at,
        updated_at: activationToken.updated_at,
      },
      { status: 200 },
    );

    cacheControl.setNoCache(response);
    return response;
  } catch (error) {
    return onErrorHandler(error);
  }
}

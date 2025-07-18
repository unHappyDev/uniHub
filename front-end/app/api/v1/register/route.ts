import { NextResponse } from "next/server";
import registerUser from "@/lib/models/register";
import validator from "@/lib/models/validator/validator";
import cacheControl from "@/lib/models/cache-control";
import onErrorHandler from "@/lib/errors/handler";
import { createUserRule } from "@/lib/models/firewall/rules";
import clientIp from "@/lib/models/context/client-ip";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = validator.validateRegister(body);

    const ip = clientIp.getClientIpFromRequest(request);
    await createUserRule(ip, "");

    const newUser = await registerUser.registerUser(
      username,
      email,
      password,
      ip,
    );

    const response = NextResponse.json(
      {
        id: newUser.id,
        username: newUser.username,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
        is_active: newUser.is_active,
      },
      { status: 201 },
    );
    cacheControl.setNoCache(response);

    return response;
  } catch (error) {
    return onErrorHandler(error);
  }
}

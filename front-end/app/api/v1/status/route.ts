import onErrorHandler from "@/lib/errors/handler";
import health from "@/lib/models/health";
import { formatISO } from "date-fns";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const checkedDependencies = await health.getDependencies();

    const response = NextResponse.json(
      {
        updated_at: formatISO(Date.now()),
        dependencies: checkedDependencies,
      },
      { status: 201 },
    );
    return response;
  } catch (error) {
    return onErrorHandler(error);
  }
}

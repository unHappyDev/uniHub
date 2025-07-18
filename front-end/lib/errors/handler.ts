import { NextResponse } from "next/server";
import InternalServerError from "@/lib/errors/internal-server-error";
import UnauthorizedError from "@/lib/errors/unauthorized-error";
import ValidationError from "@/lib/errors/validation-error";
import MethodNotAllowedError from "@/lib/errors/method-not-allowed-error";
import NotFoundError from "@/lib/errors/not-found-error";
import ForbiddenError from "@/lib/errors/forbidden-error";
import UnprocessableEntityError from "@/lib/errors/unprocessable-entity-error";
import TooManyRequestsError from "@/lib/errors/too-many-requests-error";
import ServiceError from "@/lib/errors/service-error";

export default function onErrorHandler(error: unknown) {
  if (
    error instanceof UnauthorizedError ||
    error instanceof ValidationError ||
    error instanceof MethodNotAllowedError ||
    error instanceof NotFoundError ||
    error instanceof ForbiddenError ||
    error instanceof UnprocessableEntityError ||
    error instanceof TooManyRequestsError ||
    error instanceof ServiceError
  ) {
    return NextResponse.json(
      { error: error.toJSON() },
      { status: error.statusCode },
    );
  }

  const internalServerError = new InternalServerError(error);

  console.error(internalServerError);

  return NextResponse.json(
    { error: internalServerError.toJSON() },
    { status: internalServerError.statusCode },
  );
}

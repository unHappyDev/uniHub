import BaseError from "./base-error";

export default class ValidationError extends BaseError {
  private action: string;
  public statusCode: number;

  constructor({
    cause,
    message = "A validation error occurred.",
    action = "Adjust the data sent and try again.",
  }: {
    cause?: unknown;
    message?: string;
    action?: string;
  } = {}) {
    super(message, {
      cause,
    });
    this.name = "ValidationError";
    this.action = action;
    this.statusCode = 400;

    Object.setPrototypeOf(this, ValidationError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

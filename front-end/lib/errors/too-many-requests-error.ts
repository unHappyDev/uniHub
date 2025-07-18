import BaseError from "./base-error";

export default class TooManyRequestsError extends BaseError {
  private action: string;
  public statusCode: number;

  constructor({
    cause,
    message = "You have made too many requests recently.",
    action = "Please try again later or contact support if you believe this is an error.",
  }: {
    cause?: unknown;
    message?: string;
    action?: string;
  } = {}) {
    super(message, {
      cause,
    });
    this.name = "TooManyRequestsError";
    this.action = action;
    this.statusCode = 429;
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

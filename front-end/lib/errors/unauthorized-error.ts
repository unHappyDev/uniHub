import BaseError from "./base-error";

export default class UnauthorizedError extends BaseError {
  private action: string;
  public statusCode: number;

  constructor({
    cause,
    message = "User not authenticated.",
    action = "Please log in again to continue.",
  }: {
    cause?: unknown;
    message?: string;
    action?: string;
  } = {}) {
    super(message, {
      cause,
    });
    this.name = "UnauthorizedError";
    this.action = action;
    this.statusCode = 401;
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

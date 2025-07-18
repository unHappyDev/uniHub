import BaseError from "./base-error";

export default class ForbiddenError extends BaseError {
  private action: string;
  public statusCode: number;

  constructor({
    cause,
    message = "You do not have permission to perform this action.",
    action = "Verify that you have permission to perform this action.",
  }: {
    cause?: unknown;
    message?: string;
    action?: string;
  } = {}) {
    super(message, {
      cause,
    });
    this.name = "ForbiddenError";
    this.action = action;
    this.statusCode = 403;
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

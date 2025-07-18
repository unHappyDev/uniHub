import BaseError from "./base-error";

export default class MethodNotAllowedError extends BaseError {
  private action: string;
  public statusCode: number;

  constructor({
    cause,
    message = "Method not allowed for this endpoint.",
    action = "Check if the HTTP method sent is valid for this endpoint.",
  }: {
    cause?: unknown;
    message?: string;
    action?: string;
  } = {}) {
    super(message, {
      cause,
    });
    this.name = "MethodNotAllowedError";
    this.action = action;
    this.statusCode = 405;
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

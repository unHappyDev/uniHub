import BaseError from "./base-error";

export default class ServiceError extends BaseError {
  private action: string;
  public statusCode: number;

  constructor({
    cause,
    message = "Service currently unavailable.",
  }: {
    cause?: unknown;
    message?: string;
  } = {}) {
    super(message, {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Contact support.";
    this.statusCode = 503;
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

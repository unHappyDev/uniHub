import BaseError from "./base-error";

export default class InternalServerError extends BaseError {
  private action: string;
  public statusCode: number;

  constructor(cause?: unknown) {
    super("An unexpected internal error occurred.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Contact support.";
    this.statusCode = 500;
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

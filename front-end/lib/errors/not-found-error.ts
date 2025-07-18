import BaseError from "./base-error";

export default class NotFoundError extends BaseError {
  private action: string;
  public statusCode: number;

  constructor({
    cause,
    message = "This resource could not be found in the system.",
    action = "Check if the parameters sent in the query are correct.",
  }: {
    cause?: unknown;
    message?: string;
    action?: string;
  } = {}) {
    super(message, {
      cause,
    });
    this.name = "NotFoundError";
    this.action = action;
    this.statusCode = 404;
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

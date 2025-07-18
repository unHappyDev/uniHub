import BaseError from "./base-error";

export default class UnprocessableEntityError extends BaseError {
  private action: string;
  public statusCode: number;

  constructor({
    cause,
    message = "It was not possible to perform this operation.",
    action = "The data sent is correct, but it was not possible to perform this operation.",
  }: {
    cause?: unknown;
    message?: string;
    action?: string;
  } = {}) {
    super(message, { cause });
    this.name = "UnprocessableEntityError";
    this.action = action;
    this.statusCode = 422;
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

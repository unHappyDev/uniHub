/* eslint-disable @typescript-eslint/no-explicit-any */
export default class BaseError extends WithStackTrace(Error) {
  constructor(...args: any[]) {
    super(...args);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
  }
}

type ErrorConstructor<T = Error> = new (...args: any[]) => T;

function WithStackTrace<TBase extends ErrorConstructor>(Base: TBase) {
  return class extends Base {
    origin?: { file: string; line: number; column: number };

    constructor(...args: any[]) {
      super(...args);
      this.origin = this.getOriginFromStack();
    }

    private getOriginFromStack() {
      if (!this.stack) {
        return undefined;
      }

      const stackLines = this.stack.split("\n");

      if (stackLines.length < 2) {
        return undefined;
      }

      const stackLine = stackLines[1].trim();
      const nodeMatch = stackLine.match(/at (.+) \((.+):(\d+):(\d+)\)/);
      const browserMatch = stackLine.match(/at (.+):(\d+):(\d+)/);

      const match = nodeMatch || browserMatch;

      if (!match) {
        return undefined;
      }

      return {
        file: match[2] || match[1],
        line: parseInt(match[3]),
        column: parseInt(match[4] || match[3]),
      };
    }
  };
}

import { configs } from "./configs";

class AppError extends Error {
  constructor(message: string) {
    super(message);
    if (configs.Env == "development") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
import Rollbar from 'rollbar';
import winston from 'winston';
import { green, red, yellow } from 'colorette';
import { configs } from '../../utils/configs';

// Define log format with Colorette colorization
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  let colorizedMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;

  // Apply Colorette colors based on log level
  switch (level) {
    case 'info':
      colorizedMessage = green(colorizedMessage);
      break;
    case 'error':
      colorizedMessage = red(colorizedMessage);
      break;
    case 'warn':
      colorizedMessage = yellow(colorizedMessage);
      break;
    default:
      break;
  }

  return colorizedMessage;
});

// Configure loggers
const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [new winston.transports.Console()],
});

const rollbarLogger = new Rollbar({
  accessToken: 'your-access-token',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV,
});

/**
 * Logger class that abstracts different logging mechanisms.
 * It uses either Rollbar or Winston for logging based on the environment.
 * In production, it logs to Rollbar. In other environments, it logs to the console using Winston.
 */
class Logger {
  private logger: Rollbar | winston.Logger;

  constructor() {
    this.logger = configs.Env === 'production' ? rollbarLogger : winstonLogger;
  }

  /**
   * Logs an informational message. This will be output to Rollbar or Winston based on the environment.
   * @param {string} message - The message to log.
   */
  public info(message: string) {
    if (this.logger instanceof Rollbar) {
      this.logger.info(message);
    } else {
      this.logger.info(message);
    }
  }

  /**
   * Logs an error message. This will be output to Rollbar or Winston based on the environment.
   * @param {string} message - The message to log.
   */
  public error(message: string) {
    if (this.logger instanceof Rollbar) {
      this.logger.error(message);
    } else {
      this.logger.error(message);
    }
  }

}

const logger = new Logger();

export default logger;

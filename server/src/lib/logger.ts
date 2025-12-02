import winston from "winston";
import "winston-daily-rotate-file";

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
});

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`
  )
);

const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%-app.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(winston.format.colorize({ all: true }), logFormat),
});

const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports: [
    dailyRotateTransport,
    ...(process.env.NODE_ENV !== "production" ? [consoleTransport] : []),
  ],
  exitOnError: false,
});

// Add stream for morgan compatibility
(logger as any).stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;

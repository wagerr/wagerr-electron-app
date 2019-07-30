import { app } from 'electron';

const path = require('path');
const { createLogger, format, transports } = require('winston');

const { colorize, combine, padLevels, printf, timestamp } = format;

let logger;

// Add a custom format to the logger.
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

// This is the main app logger, if in development mode it also logs to console.
export function spawnLogger() {
  // If logger already exists return the existing logger.
  if (logger) {
    return logger;
  }

  // Create the logger.
  logger = createLogger({
    format: combine(timestamp(), padLevels(), logFormat),
    transports: [
      new transports.File({
        filename: path.join(app.getPath('userData'), 'wagerr-electron-app.log')
      })
    ]
  });

  // If we're not in production then also log to the console.
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new transports.Console({
        level: 'debug',
        format: combine(colorize(), logFormat)
      })
    );
  }

  return logger;
}

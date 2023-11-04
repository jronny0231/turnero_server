import path from "path"
import winston from "winston";
import { verifyOrCreateFolder } from "./file.helpers";

const FILE_PATH = path.resolve(process.env.LOG_PATH ?? "./logs")

const HTTP_FILE = path.join(FILE_PATH, 'http.log')
const ERR_FILE = path.join(FILE_PATH, 'err.log')
const LOG_FILE = path.join(FILE_PATH, 'inf.log')

enum ENV_TYPE {
    DEV = "development",
    PROD = "production"
}
const ENVIRONMENT = process.env.NODE_ENV as ENV_TYPE ?? ENV_TYPE.DEV

verifyOrCreateFolder(FILE_PATH)

const level = () => {
    const isDevelopment = ENVIRONMENT === ENV_TYPE.DEV
    return isDevelopment ? 'debug' : 'warn'
}

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors)


// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
    // Add the message timestamp with the preferred format
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // Tell Winston that the message not will be colorized
    winston.format.uncolorize(),
    // Add a title label before the log
    winston.format.label({ label: 'LOG' }),
    // Define the format of the message showing the timestamp, the level and the message
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
)

// Define which transports the logger must use to print out messages.
const transports = [

    // Allow the use the console to print the messages
    new winston.transports.Console({ format: winston.format.colorize({ all: true }) }),

    // Allow to print all the http level messages inside the http.log file
    new winston.transports.File({ filename: HTTP_FILE, level: 'http' }),

    // Allow to print all the error level messages inside the error.log file
    new winston.transports.File({ filename: ERR_FILE, level: 'error' }),

    // Allow to print all the error message inside the log file
    // (also the logs that are also printed inside the error.log and http.log)
    new winston.transports.File({ filename: LOG_FILE }),
]

// Create the logger instance that has to be exported
// and used to log messages.
const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
})

export default logger
export {
    ENVIRONMENT as env,
    ENV_TYPE as envTypes,
}

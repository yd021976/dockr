const { createLogger, format, transports } = require('winston');

const customFormat = format.printf(({ level, message, meta }) => {
  // return `ts:${timestamp};level:${level};message:${message};meta:${meta ? JSON.stringify(meta).replace(/\\n/g, "\\n\\r") : ''}`;
  return `${level};${message};${meta ? meta.replace(/\\n/g, "\\n\\r") : ''}`;
})

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'info',
  format: format.combine(
    format.splat(),
    format.simple(),
    // customFormat
  ),
  transports: [
    new transports.Console()
  ],
});

module.exports = logger;

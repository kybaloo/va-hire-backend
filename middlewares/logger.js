const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Create a write stream for error logs
const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

// Custom token for request body
morgan.token('body', (req) => JSON.stringify(req.body));

// Access log format
const accessLogFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :body';

// Error log format
const errorLogFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :body';

// Create access logger
const accessLogger = morgan(accessLogFormat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400
});

// Create error logger
const errorLogger = morgan(errorLogFormat, {
  stream: errorLogStream,
  skip: (req, res) => res.statusCode < 400
});

module.exports = {
  accessLogger,
  errorLogger
}; 
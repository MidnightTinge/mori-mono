import Logger, {createLogger} from 'bunyan';
import {Writable as WritableStream} from 'stream';
import chalk from 'chalk';

const LEVELS: Record<string, string> = {
  '60': chalk.red.bold('FATAL'),
  '50': chalk.red('ERROR'),
  '40': chalk.yellow(' WARN'),
  '30': chalk.cyan(' INFO'),
  '20': chalk.gray('DEBUG'),
  '10': chalk.gray('TRACE'),
};

// used to parse and print human-readable logs to stdout
const _consoleProxy = new WritableStream();
_consoleProxy._write = (chunk, encoding, next) => {
  try {
    const parsed = JSON.parse(chunk);
    const addon = parsed.err?.stack ? `\n${parsed.err.stack}` : '';

    const _uidChunk = parsed.user?.uid ? `/${parsed.user.uid.substring(0, 8)}` : '';
    process.stdout.write(`${parsed.time} [${LEVELS[String(parsed.level)] || parsed.level}] ${chalk.white.italic(parsed.service)}${chalk.white.underline(_uidChunk)}: ${parsed.msg}${addon}\n`);
  } catch (ignored) {
    process.stdout.write(chunk + '\n');
  }

  next();
};

const _level = process.env.NODE_ENV !== 'production' ? 'debug' : 'info';
const streams: Logger.Stream[] = [
  {
    level: _level,
    stream: _consoleProxy,
  },
];

// if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
//   process.env.GOOGLE_APPLICATION_CREDENTIALS =
//     config.google.applicationCredentials
// }
//
// if (process.env.GOOGLE_APPLICATION_CREDENTIALS && existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
//   streams.push(new LoggingBunyan({
//     projectId: config.GOOGLE_PROJECT_ID,
//     logName: 'api',
//   }).stream(_level))
//   process.stdout.write(`[${chalk.gray(' DEBUG')}] Injected GCP Logging stream.\n`)
// }

export const logger = createLogger({
  name: 'api',
  streams,

  node_env: process.env.NODE_ENV || 'null',
  service: 'unknown',
});

/**
 * Gets a logger for a specific service. The service is treated as a discriminator and is be
 * prepended to messages on stdout, then injected as a data param on GCP for filtering.
 *
 * @param service The service descriptor, e.g. "helper.admin" or "route.users"
 * @param meta Any metadata we should attach by default
 */
export default function getLogger(service: string, meta?: Record<string, any>): Logger {
  return logger.child({
    service,
    ...(meta || {}),
  });
}

export function formatError(error: Error) {
  return {
    message: error?.message,
    name: error?.name,
    stack: error?.stack,
  };
}

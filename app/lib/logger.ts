// Only import Node.js modules on the server
const fs = typeof window === 'undefined' ? require('fs') : null;
const path = typeof window === 'undefined' ? require('path') : null;

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private logFile: string;
  private maxFileSize: number = 10 * 1024 * 1024; // 10MB

  constructor() {
    // Skip file operations on client side
    if (typeof window !== 'undefined' || !fs || !path) {
      this.logFile = '';
      return;
    }

    // During build or when running in a read-only environment, skip file operations
    if (this.isBuildPhase()) {
      this.logFile = '';
      return;
    }

    // Use different paths for production (Docker) and development
    this.logFile =
      process.env.NODE_ENV === 'production'
        ? '/app/logs/app.log'
        : path.join(process.cwd(), 'logs', 'app.log');

    this.ensureLogDirectory();
  }

  private isBuildPhase(): boolean {
    return (
      process.env.NEXT_PHASE === 'phase-production-build' ||
      (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL)
    );
  }

  private ensureLogDirectory() {
    if (!fs || !path) return;
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  private rotateLogsIfNeeded() {
    try {
      if (fs.existsSync(this.logFile)) {
        const stats = fs.statSync(this.logFile);
        if (stats.size > this.maxFileSize) {
          const timestamp = new Date().toISOString().split('T')[0];
          const rotatedFile = `${this.logFile}.${timestamp}`;
          fs.renameSync(this.logFile, rotatedFile);

          // Keep only last 5 rotated files
          this.cleanupOldLogs();
        }
      }
    } catch (error) {
      // If rotation fails, continue logging to the same file
      console.error('Failed to rotate logs:', error);
    }
  }

  private cleanupOldLogs() {
    try {
      const logDir = path.dirname(this.logFile);
      const files = fs
        .readdirSync(logDir)
        .filter((file) => file.startsWith('app.log.'))
        .sort()
        .reverse();

      // Keep only the 5 most recent rotated files
      files.slice(5).forEach((file) => {
        fs.unlinkSync(path.join(logDir, file));
      });
    } catch {
      // Non-critical error, ignore
    }
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    // During build phase, skip logging entirely
    if (this.isBuildPhase()) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: data || undefined,
    };

    // In development, also log to console
    if (process.env.NODE_ENV === 'development') {
      const color = {
        info: '\x1b[36m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
        debug: '\x1b[90m',
      }[level];
      const reset = '\x1b[0m';

      console.log(`${color}[${level.toUpperCase()}]${reset} ${message}`, data || '');
    }

    // Write to file if on server
    if (fs && this.logFile) {
      try {
        this.rotateLogsIfNeeded();
        const logLine = JSON.stringify(logEntry) + '\n';
        fs.appendFileSync(this.logFile, logLine);
      } catch (error) {
        // Fallback to console if file writing fails
        console.error('Failed to write to log file:', error);
        console.log(`[${level.toUpperCase()}]`, message, data);
      }
    }
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, error?: unknown) {
    const errorData =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            ...error,
          }
        : error;

    this.log('error', message, errorData);
  }

  debug(message: string, data?: unknown) {
    // Only log debug messages in development
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

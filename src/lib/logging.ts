export interface Logger {
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  error: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
}

class ConsoleLogger implements Logger {
  info(message: string, ...args: any[]): void {
    console.log(`[INFO] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}

export const logger: Logger = new ConsoleLogger();

export interface APIRequestLog {
  method: string
  url: string
  statusCode: number
  duration: number
  ip?: string
  userAgent?: string
  error?: string
  timestamp?: Date
}

export async function logAPIRequest(data: APIRequestLog): Promise<void> {
  const logData = {
    ...data,
    timestamp: data.timestamp || new Date()
  };

  if (data.error) {
    logger.error(`API ${data.method} ${data.url} - Status: ${data.statusCode} - Duration: ${data.duration}ms - Error: ${data.error}`, logData);
  } else if (data.statusCode >= 400) {
    logger.warn(`API ${data.method} ${data.url} - Status: ${data.statusCode} - Duration: ${data.duration}ms`, logData);
  } else {
    logger.info(`API ${data.method} ${data.url} - Status: ${data.statusCode} - Duration: ${data.duration}ms`, logData);
  }
}

export default logger;

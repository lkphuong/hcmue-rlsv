import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

import { writeFile } from '../../../utils/log';

@Injectable({ scope: Scope.TRANSIENT })
export class LogService extends ConsoleLogger {
  writeLog(level: string, method: string, path: string, message: string) {
    const data = `[${level}] ${new Date().toISOString()}: [${method} ${path}] ${message}\r\n`;
    writeFile(data);
  }
}

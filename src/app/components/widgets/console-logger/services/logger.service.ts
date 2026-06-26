import {inject, Injectable, signal} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {LogLine} from "../model/log-line";
import {LogLevel} from "../model/log-level";

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private clipboard = inject(Clipboard);

  private _logs = signal<LogLine[]>([]);

  readonly logs = this._logs.asReadonly();

  private log(line: LogLine): void {
    this._logs.update(logs => [...logs, line]);
  }

  debug(msg: string, source: string): void {
    const line: LogLine = new LogLine(msg, LogLevel.Debug, source);
    this.log(line);
  }

  info(msg: string, source: string): void {
    const line: LogLine = new LogLine(msg, LogLevel.Info, source);
    this.log(line);
  }

  warn(msg: string, source: string): void {
    const line: LogLine = new LogLine(msg, LogLevel.Warn, source);
    this.log(line);
  }

  error(msg: string, source: string): void {
    const line: LogLine = new LogLine(msg, LogLevel.Error, source);
    this.log(line);
  }

  clear(): void {
    this._logs.set([]);
  }

  /**
   * Copy the content from the log to a clipboard.
   * Presently the format we use is 'timestamp - log level - source (this is currently the source of the class) - message'
   */
  copyLogs(): void {
    const logs = this._logs().map(logLine =>
      `${logLine.timeStamp} - ${logLine.level} - ${logLine.source} - ${logLine.line}`
    ).join("\n");
    this.clipboard.copy(logs);
  }
}

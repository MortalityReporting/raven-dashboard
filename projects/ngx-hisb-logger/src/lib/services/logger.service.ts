import { Injectable } from '@angular/core';
import { BehaviorSubject} from "rxjs";
import {LogLevel} from "../modal/log-level";
import {LogLine} from "../modal/log-line";
@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private logStream = new BehaviorSubject<LogLine[]>([]);
  logStream$ = this.logStream.asObservable();
  private log(line: LogLine) {
    this.logStream.next(this.logStream.value.concat(line));
  }

  debug(msg: string, source: string) {
    const line: LogLine = new LogLine(msg, LogLevel.Debug, source);
    this.log(line);
  }

  info(msg: string, source: string) {
    const line: LogLine = new LogLine(msg, LogLevel.Info, source);
    this.log(line);
  }

  warn(msg: string, source: string) {
    const line: LogLine = new LogLine(msg, LogLevel.Warn, source);
    this.log(line);
  }

  error(msg: string, source: string) {
    const line: LogLine = new LogLine(msg, LogLevel.Error, source);
    this.log(line);
  }

  clear() {
    this.logStream.next([])
  }
}

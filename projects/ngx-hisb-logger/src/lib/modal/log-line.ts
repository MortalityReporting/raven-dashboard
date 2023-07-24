import {LogLevel} from "./log-level";

export class LogLine {
  timeStamp: Date;
  line: string;
  level: LogLevel; // (enum w/ INFO | WARN | ERROR etc.)
  tags: string[]; // For filtering.
  source: string; // The source class, e.g. "DocumentHandler", should be able to inject this pretty easily
  attachment?: any;

  constructor(line: string, level: LogLevel, source: string, tags?: string[], attachment?: any){
    this.timeStamp = new Date();
    this.line = line;
    this.level =  level;
    this.tags = tags ?? [];
    this.source = source;
    this.attachment = attachment ?? null;
  }
}

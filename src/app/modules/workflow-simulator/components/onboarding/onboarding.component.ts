import {Component, OnInit} from '@angular/core';
import {LoggerService} from "../../../../../../projects/ngx-hisb-logger/src/lib/services/logger.service";
import {LogLine} from "../../../../../../projects/ngx-hisb-logger/src/lib/modal/log-line";

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit{
  loggerData: LogLine[];
  componentName = this.constructor.name;
  constructor(
    private log: LoggerService,
  ) {}
  logMessage(level: string) {
    console.log(this.constructor.name)
    if(level === 'info'){
      this.log.info("I am an Info Message", this.componentName);
    }
    else if (level === 'warn') {
      this.log.warn("I am a Warning Message", this.componentName);
    }
    else if (level === 'error') {
      this.log.error("I am an Error Message", this.componentName);
    }
  }

  clearLog(){
    this.log.clear()
  }

  ngOnInit(): void {
    this.log.logStream$.subscribe(value=> this.loggerData = value);

  }
}

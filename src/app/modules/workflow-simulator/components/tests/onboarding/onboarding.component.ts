import {Component, OnInit} from '@angular/core';
import {LogLine} from "../../../../../../../projects/ngx-hisb-logger/src/lib/modal/log-line";
import {LoggerService} from "../../../../../../../projects/ngx-hisb-logger/src/lib/services/logger.service";

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit{
  constructor(
    private log: LoggerService,
  ){}

  loggerData: LogLine[];
  componentCounterArray: number[] = [0];

  clearLog(){
    this.log.clear()
  }

  ngOnInit(): void {
    this.log.logStream$.subscribe(value=> this.loggerData = value);
  }

  addComponent() {
    this.componentCounterArray.push(this.componentCounterArray.length -1);
  }

  removeComponent(index: number) {
    this.componentCounterArray.splice(index, 1);
  }
}

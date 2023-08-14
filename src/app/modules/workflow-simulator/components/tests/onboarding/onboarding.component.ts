import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LogLine} from "../../../../../../../projects/ngx-hisb-logger/src/lib/modal/log-line";
import {LoggerService} from "../../../../../../../projects/ngx-hisb-logger/src/lib/services/logger.service";
import {MatAccordion} from "@angular/material/expansion";

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit, AfterViewInit{
  @ViewChild(MatAccordion) accordion: MatAccordion;
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

  addStage() {
    this.componentCounterArray.push(this.componentCounterArray.length -1);
  }

  removeComponent(index: number, event?: any) {
    this.componentCounterArray.splice(index, 1);
  }

  ngAfterViewInit(): void {
    setTimeout(()=> {
      this.accordion.openAll();
    });
  }

  getStageIndex(i: number) {
    return i+1;
  }
}

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LogLine} from "../../../../../../../projects/ngx-hisb-logger/src/lib/modal/log-line";
import {MatAccordion} from "@angular/material/expansion";
import {LoggerService} from "ngx-hisb-logger";

export interface Stage {
  index: number;
  expanded: boolean;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    private log: LoggerService,
  ){}

  loggerData: LogLine[];
  stageList: Stage[] =[];

  clearLog(){
    this.log.clear()
  }

  ngOnInit(): void {
    this.log.logStream$.subscribe(value=> this.loggerData = value);
    this.addStage();
  }

  addStage() {
    this.stageList.push({index: this.stageList.length+ 1, expanded: true})
  }

  removeComponent(index: number, event?: any) {
    this.stageList.splice(index, 1);
  }

  getStageIndex(i: number) {
    return i+1;
  }

}

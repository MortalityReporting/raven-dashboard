import {Component, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {LogLine} from "../../../../../../projects/ngx-hisb-logger/src/lib/modal/log-line";
import {LoggerService} from "../../../../../../projects/ngx-hisb-logger/src/lib/services/logger.service";
import {HttpConnectionComponent} from "./http-connection/http-connection.component";

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit{

  @ViewChild("viewContainerRef", { read: ViewContainerRef }) vcr!: ViewContainerRef;
  ref!: ComponentRef<HttpConnectionComponent>

  httpConnectionCount: number = 1;

  addChild() {
    this.ref = this.vcr.createComponent(HttpConnectionComponent)
  }

  removeChild() {
    const index = this.vcr.indexOf(this.ref.hostView)
    if (index != -1) this.vcr.remove(index)
  }

  loggerData: LogLine[];

  constructor(
    private log: LoggerService,
  ){}
  clearLog(){
    this.log.clear()
  }

  ngOnInit(): void {
    this.log.logStream$.subscribe(value=> this.loggerData = value);
   // this.addChild();
  }
}

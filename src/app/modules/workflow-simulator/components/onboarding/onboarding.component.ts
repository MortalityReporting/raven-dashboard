import {Component, ComponentFactory, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {LogLine} from "../../../../../../projects/ngx-hisb-logger/src/lib/modal/log-line";
import {LoggerService} from "../../../../../../projects/ngx-hisb-logger/src/lib/services/logger.service";
import {HttpConnectionComponent} from "./http-connection/http-connection.component";

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit{
  @ViewChild('httpConnectionContainerRef', { read: ViewContainerRef }) httpConnectionContainer: ViewContainerRef;
  constructor(
    private log: LoggerService,
  ){}
  addHttpConnectionComponent() {
    const componentRef = this.httpConnectionContainer.createComponent(HttpConnectionComponent);
    componentRef.instance.removeConnection.subscribe(() => this.removeHttpConnectionComponent(componentRef));
  }

  removeHttpConnectionComponent(componentRef: any) {
    const index = this.httpConnectionContainer.indexOf(componentRef.hostView);
    this.httpConnectionContainer.remove(index);
    componentRef.destroy();
  }

  loggerData: LogLine[];

  clearLog(){
    this.log.clear()
  }

  ngOnInit(): void {
    this.log.logStream$.subscribe(value=> this.loggerData = value);
  }
}

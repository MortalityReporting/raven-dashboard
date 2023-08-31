import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Registration} from "../../models/registration";
import {EventManagerService} from "../../services/event-manager.service";
import {EventModule} from "../../models/event-module";

@Component({
  selector: 'testing-event-registered-module',
  templateUrl: './registered-module.component.html',
  styleUrls: ['./registered-module.component.scss']
})
//TODO: Rename to RegistrationStatus
export class RegisteredModuleComponent implements OnInit{
  @Input() userId: string;
  currentRegistration: Registration;
  currentEvent: EventModule;

  constructor(
      public eventModuleManager: EventManagerService,
      private router: Router
  ) {
  }

  ngOnInit(): void {
    this.eventModuleManager.currentRegistration$.subscribe({
      next: (value: Registration) => {
        this.currentRegistration = value;
      }
    });
    this.eventModuleManager.currentEvent$.subscribe({
      next: (value: EventModule) => {
        this.currentEvent = value;
      }
    })
  }

  loadTestContainer(eventItem: any) {
    this.router.navigate(['/workflow-simulator/test'], {
      state: {
        eventItem: eventItem,
        eventRegistration: this.currentRegistration,
        userId: this.userId
      } }).then(r => console.log(r));
  }
}

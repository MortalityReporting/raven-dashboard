import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Registration} from "../../models/registration";
import {EventManagerService} from "../../services/event-manager.service";
import {EventModule} from "../../models/event-module";
import {QuestionnaireResponseItem} from "../../../fhir-util";
import {combineLatest, map, skipWhile} from "rxjs";
import {MdiToEdrsRecord} from "../../../record-viewer/models/mdiToEdrsRecord";
import {RegistrationDisplay, RegistrationDisplayItem} from "../../models/registration-display";
import {EventItem} from "../../models/event-item";

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
  registrationDisplay: RegistrationDisplay;

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
    const currentRegistration$ = this.eventModuleManager.currentRegistration$;
    const currentEvent$ = this.eventModuleManager.currentEvent$;
    // .subscribe({
    //   next: (value: EventModule) => {
    //     this.currentEvent = value;
    //   }
    // });
    combineLatest([currentRegistration$, currentEvent$]).pipe(
      skipWhile(combinedResults => combinedResults.some(result => result === undefined)),
      map(combinedResults => {
        const currentRegistration: Registration = combinedResults[0];
        this.currentRegistration = currentRegistration;
        const currentEvent: EventModule = combinedResults[1];
        this.currentEvent = currentEvent;

        let registrationDisplay: RegistrationDisplay = new RegistrationDisplay();
        registrationDisplay.title = currentEvent.title;
        this.currentEvent.items.forEach((eventItem: EventItem) => {
          let displayItem: RegistrationDisplayItem = new RegistrationDisplayItem();
          displayItem.name = eventItem.name;
          const qrItem = currentRegistration.item.find((qrItem: QuestionnaireResponseItem) => qrItem.linkId === eventItem.linkId);
          displayItem.status = qrItem.answer[0].valueCoding.code;
          registrationDisplay.items.push(displayItem);
        });
        return registrationDisplay;
      })).subscribe({
      next: (value: RegistrationDisplay) => {
        this.registrationDisplay = value;
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

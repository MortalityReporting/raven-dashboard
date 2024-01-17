import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {Registration} from "../../models/registration";
import {EventManagerService} from "../../services/event-manager.service";
import {EventModule} from "../../models/event-module";
import {QuestionnaireResponseItem} from "../../../fhir-util";
import {combineLatest, map, skipWhile} from "rxjs";
import {RegistrationDisplay, RegistrationDisplayItem} from "../../models/registration-display";
import {EventItem} from "../../models/event-item";
import {TestStatusDictionary} from "../../models/test-status";

@Component({
  selector: 'testing-event-registered-module',
  templateUrl: './registered-module.component.html',
  styleUrls: ['./registered-module.component.scss']
})
//TODO: Rename to RegistrationStatus
export class RegisteredModuleComponent implements OnInit{
  @Output() itemSelected = new EventEmitter()
  @Input() userId: string;
  currentRegistration: Registration;
  currentEvent: EventModule;
  registrationDisplay: RegistrationDisplay;
  completedTestCounter: number = 0;

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
    combineLatest([currentRegistration$, currentEvent$]).pipe(
      skipWhile(combinedResults => combinedResults.some(result => result === undefined)),
      map(combinedResults => {
        this.currentRegistration = combinedResults[0];
        this.currentEvent = combinedResults[1];

        let registrationDisplay: RegistrationDisplay = new RegistrationDisplay();
        registrationDisplay.title = this.currentEvent.title;
        this.currentEvent.items.forEach((eventItem: EventItem) => {
          let displayItem: RegistrationDisplayItem = new RegistrationDisplayItem();
          displayItem.eventTitle = this.currentEvent.title; // Set title of entire event for passing to test container.
          displayItem.testName = eventItem.name; // Test Name
          displayItem.linkId = eventItem.linkId; // Test LinkId
          displayItem.testCode = eventItem.code; // Code used to determine test loaded
          const qrItem = this.currentRegistration.item.find((qrItem: QuestionnaireResponseItem) => qrItem.linkId === eventItem.linkId);
          displayItem.testStatus = qrItem.answer[0].valueCoding.code; // Test Status
          registrationDisplay.items.push(displayItem);
        });
        return registrationDisplay;
      })).subscribe({
      next: (value: RegistrationDisplay) => {
        this.registrationDisplay = value;
        this.completedTestCounter = value.items.filter(test=> test.testStatus == 'complete').length;
      }
    })
  }

  loadTestContainer(displayItem: RegistrationDisplayItem) {
    this.itemSelected.emit(displayItem);
  }

  protected readonly TestStatusDictionary = TestStatusDictionary;
}

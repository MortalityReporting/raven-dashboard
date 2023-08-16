import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {EventRegistration} from "../../models/event-registration";
import {combineLatest, mergeMap, repeat, skipWhile, Subject} from "rxjs";
import {UserProfileManagerService} from "../../../user-management";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {EventModule} from "../../models/event-module";
import {EventModuleManagerService} from "../../services/event-module-manager.service";
import {QuestionnaireResponse} from "../../../fhir-util/models/resources/questionnaireResponse";

@Component({
  selector: 'testing-event-root',
  templateUrl: './testing-event-root.component.html',
  styleUrls: ['../testing-event.scss']
})
export class TestingEventRootComponent implements OnInit {
  registrations: EventRegistration[];
  currentlySelectedRegistration: EventRegistration;
  eventList: EventModule[];
  userFhirId: string;

  refreshTrigger$ = new Subject<any>();

  constructor(@Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
              public auth: AuthService,
              protected eventModuleManager: EventModuleManagerService,
              private userProfileManager: UserProfileManagerService) {}

  ngOnInit(): void {
    let events$ = this.eventModuleManager.getAllEvents();
    let user$ = this.userProfileManager.currentUser$;
    combineLatest([events$, user$]).pipe(
      skipWhile(combinedResults => combinedResults.some(result => result === undefined)),
      mergeMap(combinedResults => {
        const events = combinedResults[0];
        const user = combinedResults[1];
        this.eventList = events as EventModule[];
        this.userFhirId = user.fhirId;
        return this.eventModuleManager.getAllRegistrations(user.fhirId, events);}
      ))
      .subscribe({
        next: registrations => {this.registrations = registrations;},
    });
  }

  selectEvent(index: number) {
    if (index === -1) {
      this.currentlySelectedRegistration = undefined;
    }
    else {
      this.currentlySelectedRegistration = this.registrations[index];
    }
  }

  isRegistered(event: EventModule): boolean {
    return this.registrations.some((registration: EventRegistration) => registration.questionnaireReference.endsWith(event.fhirId));
  }

  registerForEvent(event: any) {
    console.log(event)
    const eventRegistrationFhir = EventRegistration.createFhirResource(event, `Practitioner/${this.userFhirId}`);
    this.eventModuleManager.createNewRegistration(eventRegistrationFhir).subscribe({
      next: value => {
        console.log(value);
      },
      error: err => {
        console.error(err);
      },
    })
    console.log(JSON.stringify(eventRegistrationFhir, null, 4));

  }
}

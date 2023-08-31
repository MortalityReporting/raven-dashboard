import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {combineLatest, mergeMap, retry, skipWhile, Subject} from "rxjs";
import {UserProfileManagerService} from "../../../user-management";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {EventModule} from "../../models/event-module";
import {EventManagerService} from "../../services/event-manager.service";
import {Registration} from "../../models/registration";
import {QuestionnaireResponse} from "../../../fhir-util";

@Component({
  selector: 'testing-event-root',
  templateUrl: './testing-event-root.component.html',
  styleUrls: ['../testing-event.scss']
})
export class TestingEventRootComponent implements OnInit, OnDestroy {
  // Registrations/QuestionnaireResponses
  registrations: Registration[] = [];
  currentRegistration: Registration = undefined;
  currentIndex: number = -1;

  // Event Modules/Questionnaires
  eventList: EventModule[];

  // User's ID for subject reference.
  userFhirId: string;

  // Component Controllers
  refreshTrigger$ = new Subject<any>();

  constructor(@Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
              public auth: AuthService,
              protected eventManager: EventManagerService,
              private userProfileManager: UserProfileManagerService) {
  }

  ngOnInit(): void {
    // Subscribe to the currently selected registration. (Not set initially, updated on user selection.)
    this.eventManager.currentRegistration$.subscribe({
      next: (value: Registration) => {
        this.currentRegistration = value;
      }
    });

    // Get all events and user observables.
    let events$ = this.eventManager.getAllEvents();
    let user$ = this.userProfileManager.currentUser$;

    // Get all registrations for the current user after Events$ and Users$ return data.
    let registrations$ = combineLatest([events$, user$]).pipe(
      skipWhile(combinedResults => combinedResults.some(result => result === undefined)),
      mergeMap(combinedResults => {
          const events = combinedResults[0];
          const user = combinedResults[1];
          this.eventList = events as EventModule[];
          this.userFhirId = user.fhirId;
          return this.eventManager.getAllRegistrations(user.fhirId, events);
        }
      ));

    // Subscription for registrations separated to handle refresh. Subscribe and set the list of registrations.
    registrations$.subscribe({
        next: (registrations: Registration[]) => {
          this.registrations = registrations;
        }
      });

    // // TODO: refresh
    // whatever.pipe(retry({delay: () => this.refreshTrigger$})).subscribe({
    //   next: registrations => {
    //     this.registrations = registrations;
    //   }
    // });

    // TODO: Session Storage needs to be refactored to align with observable
    // const currentIndex = sessionStorage.getItem('index');
    // if(currentIndex){
    //   const index = parseInt(currentIndex);
    //   console.log(index)
    //   this.selectEvent(index);
    // }
  }

  selectEvent(index: number) {
    this.currentIndex = index;
    if (index === -1) {
      // If no item is selected, return current registration to undefined.
      this.eventManager.setCurrentRegistration(undefined);
      this.eventManager.setCurrentEvent(undefined);
    } else {
      // If item is selected, set current registration as it.
      const registration: Registration = this.registrations[index];
      this.eventManager.setCurrentRegistration(registration);
      const matchedEvent: EventModule = this.eventManager.matchRegistrationToEvent(registration, this.eventList)
      this.eventManager.setCurrentEvent(matchedEvent);
    }
  }

  isRegistered(event: EventModule): boolean {
    return this.registrations.some((registration: Registration) => registration.questionnaire.endsWith(event.fhirId));
  }

  getTitle(registration: Registration): string {
    const matchedEvent: EventModule = this.eventManager.matchRegistrationToEvent(registration, this.eventList);
    return matchedEvent.title;
  }


  registerForEvent(event: any) {
    console.log(event)
    const registrationAsFhir: QuestionnaireResponse = new Registration(event, `Practitioner/${this.userFhirId}`);
    this.eventManager.createNewRegistration(registrationAsFhir).subscribe({
      next: value => {
        console.log(value);
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        // TODO: Figure out where this needs to go to refresh the call and get the new registrations!
        this.refreshTrigger$.next("complete");
      }
    })
    console.log(JSON.stringify(registrationAsFhir, null, 4));

  }

  ngOnDestroy(): void {
    // sessionStorage.setItem('index', String(this.currentIndex));
  }
}

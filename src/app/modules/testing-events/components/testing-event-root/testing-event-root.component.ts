import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {combineLatest, mergeMap, Observable, ReplaySubject, retry, share, skipWhile, Subject, switchMap} from "rxjs";
import {UserProfileManagerService} from "../../../user-management";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {EventModule} from "../../models/event-module";
import {EventManagerService} from "../../services/event-manager.service";
import {Registration} from "../../models/registration";
import {QuestionnaireResponse} from "../../../fhir-util";
import {UserProfile} from "../../../user-management/models/user-profile";
import {RegistrationDisplayItem} from "../../models/registration-display";

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
  currentItem: RegistrationDisplayItem;

  // Event Modules/Questionnaires
  eventList: EventModule[];

  // User's ID for subject reference.
  userFhirId: string;

  // Component Controllers
  refreshTrigger$ = new ReplaySubject(1);
  events$: Observable<EventModule[]>;
  user$: Observable<UserProfile>;
  showRoot: boolean = true;

  constructor(@Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
              public auth: AuthService,
              protected eventManager: EventManagerService,
              private userProfileManager: UserProfileManagerService) {}

  ngOnInit(): void {
    // Subscribe to the currently selected registration. (Not set initially, updated on user selection.)
    this.eventManager.currentRegistration$.subscribe({
      next: (value: Registration) => {
        this.currentRegistration = value;
      }
    });

    // Get all events and user observables.
    this.events$ = this.eventManager.getAllEvents();
    this.user$ = this.userProfileManager.currentUser$;

    // Get all registrations for the current user after Events$ and Users$ return data.
    let registrations$ = this.refreshTrigger$.pipe(
      switchMap(() => this.fetchData()),
      share()
    );

    // Initial call to "refresh".
    this.refreshTrigger$.next(1);

    registrations$.subscribe({
        next: (registrations: Registration[]) => {
          this.registrations = registrations;
        }
      });


    // TODO: Session Storage needs to be refactored to align with observable
    // const currentIndex = sessionStorage.getItem('index');
    // if(currentIndex){
    //   const index = parseInt(currentIndex);
    //   console.log(index)
    //   this.selectEvent(index);
    // }
  }

  fetchData(): Observable<any> {
    return combineLatest([this.events$, this.user$]).pipe(
      skipWhile(combinedResults => combinedResults.some(result => result === undefined)),
      mergeMap(combinedResults => {
          const events = combinedResults[0];
          const user = combinedResults[1];
          this.eventList = events as EventModule[];
          this.userFhirId = user.fhirId;
          return this.eventManager.getAllRegistrations(user.fhirId, events);
        }
      ));
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
        this.refreshTrigger$.next(1);
      }
    })
    console.log(JSON.stringify(registrationAsFhir, null, 4));

  }

  ngOnDestroy(): void {
    // sessionStorage.setItem('index', String(this.currentIndex));
  }

  loadTestContainer(registrationDisplayItem: RegistrationDisplayItem) {
    this.showRoot = false;
    this.currentItem = registrationDisplayItem;
    console.log(registrationDisplayItem);
  }
}

import {Component, OnInit} from '@angular/core';
import {EventModule} from "../../models/event-module";
import {skipWhile, switchMap, tap} from "rxjs";
import {UserProfileManagerService} from "../../../user-management";
import {UserProfile} from "../../../user-management/models/user-profile";
import {EventManagerService} from "../../services/event-manager.service";
import {Registration} from "../../models/registration";
import {QuestionnaireResponse} from "../../../fhir-util";
import {AppConfiguration} from "../../../../providers/app-configuration";

@Component({
  selector: 'app-event-registration',
  templateUrl: './event-registration.component.html',
  styleUrl: './event-registration.component.scss'
})
export class EventRegistrationComponent implements OnInit{
  // Event Modules/Questionnaires
  eventList: EventModule[];
  currentUser: UserProfile;
  registrations: Registration[] = [];
  availableEvent: EventModule[] = [];
  registeredEvent: EventModule[] = [];
  appConfiguration: any = AppConfiguration.config;

  constructor(
      private userProfileManager: UserProfileManagerService,
      private eventManager: EventManagerService,) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(){
    this.userProfileManager.currentUser$.pipe(
        skipWhile(value=> !value),
        tap(value => this.currentUser = value),
        switchMap(() => this.eventManager.getAllEvents()),
        tap(value => this.eventList = value),
        switchMap((value)=> this.eventManager.getAllRegistrations(this.currentUser.fhirId, value))
    ).subscribe({
      next: value=> {
        this.registrations = value;
        this.availableEvent = this.eventList.filter( event=> !this.isRegistered(event));
        this.registeredEvent = this.eventList.filter( event=> this.isRegistered(event));
      }
    })
  }

  isRegistered(event: EventModule): boolean {
    return this.registrations.some((registration: Registration) => registration.questionnaire.endsWith(event.fhirId));
  }

  registerForEvent(event: any) {
    const registrationAsFhir: QuestionnaireResponse = new Registration(event, `Practitioner/${this.currentUser.fhirId}`);
    this.eventManager.createNewRegistration(registrationAsFhir).subscribe({
      next: () => {
        this.fetchData();
      },
      error: err => {
        console.error(err);
      }
    })
  }

}


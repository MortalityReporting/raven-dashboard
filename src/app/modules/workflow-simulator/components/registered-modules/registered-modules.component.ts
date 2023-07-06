import {Component, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {EventModuleManagerService, UserProfileManagerService} from "../../../user-management";
import {mergeMap, skipWhile} from "rxjs";
import {EventRegistration} from "../../../user-management/models/event-registration";
import {EventModule} from "../../../user-management/models/event-module";

@Component({
  selector: 'app-registered-modules',
  templateUrl: './registered-modules.component.html',
  styleUrls: ['./registered-modules.component.css']
})
export class RegisteredModulesComponent implements OnInit{
  events: EventModule[];
  registrations: EventRegistration[];

  constructor(
      public auth: AuthService,
      private eventModuleManager: EventModuleManagerService,
      private userProfileManager: UserProfileManagerService
  ) {
  }

  ngOnInit(): void {
    this.eventModuleManager.getAllEvents().subscribe({
        next: value => {this.events = value}}
    )
    this.userProfileManager.currentUser$.pipe(
      skipWhile(value => !value),
      mergeMap(user => this.eventModuleManager.getAllRegistrations(user.fhirId))
    ).subscribe({next: value => {this.registrations = value}})
  }


}

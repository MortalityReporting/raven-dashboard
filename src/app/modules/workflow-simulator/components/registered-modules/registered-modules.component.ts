import {Component, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {EventModuleManagerService, UserProfileManagerService} from "../../../user-management";
import {combineLatest, mergeMap, skipWhile} from "rxjs";
import {EventRegistration} from "../../../user-management/models/event-registration";

@Component({
  selector: 'app-registered-modules',
  templateUrl: './registered-modules.component.html',
  styleUrls: ['./registered-modules.component.scss']
})
export class RegisteredModulesComponent implements OnInit{
  registrations: EventRegistration[];

  constructor(
      public auth: AuthService,
      public eventModuleManager: EventModuleManagerService,
      private userProfileManager: UserProfileManagerService
  ) {
  }

  ngOnInit(): void {
    let events$ = this.eventModuleManager.getAllEvents();
    let user$ = this.userProfileManager.currentUser$;
    combineLatest([events$, user$]).pipe(
        skipWhile(combinedResults => combinedResults.some(result => result === undefined)),
        mergeMap(combinedResults => {
          const events = combinedResults[0];
          const user = combinedResults[1];
          return this.eventModuleManager.getAllRegistrations(user.fhirId, events);}
    )).subscribe({
      next: registrations => this.registrations = registrations
    });
  }


}

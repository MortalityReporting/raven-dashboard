import {Component, Input, OnInit} from '@angular/core';
import {EventRegistration} from "../../models/event-registration";
import {Router} from "@angular/router";

@Component({
  selector: 'testing-event-registered-modules',
  templateUrl: './registered-modules.component.html',
  styleUrls: ['./registered-modules.component.scss']
})
export class RegisteredModulesComponent implements OnInit{
  //registrations: EventRegistration[];
  @Input() registration: EventRegistration;

  constructor(
      //public auth: AuthService,
      //public eventModuleManager: EventModuleManagerService,
      //private userProfileManager: UserProfileManagerService,
      private router: Router
  ) {
  }

  ngOnInit(): void {
    // let events$ = this.eventModuleManager.getAllEvents();
    // let user$ = this.userProfileManager.currentUser$;
    // combineLatest([events$, user$]).pipe(
    //     skipWhile(combinedResults => combinedResults.some(result => result === undefined)),
    //     mergeMap(combinedResults => {
    //       const events = combinedResults[0];
    //       const user = combinedResults[1];
    //       return this.eventModuleManager.getAllRegistrations(user.fhirId, events);}
    // )).subscribe({
    //   next: registrations => this.registrations = registrations
    // });
  }

  loadTestContainer(eventItem: any, eventRegistration: any) {
    this.router.navigate(['/tests/test'], {
      state: {
        eventItem: eventItem,
        eventRegistration: eventRegistration
      } }).then(r => console.log(r));
  }
}

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
  @Input() userId: string;

  constructor(
      //public auth: AuthService,
      //public eventModuleManager: EventModuleManagerService,
      //private userProfileManager: UserProfileManagerService,
      private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  loadTestContainer(eventItem: any, eventRegistration: any) {
    this.router.navigate(['/workflow-simulator/test'], {
      state: {
        eventItem: eventItem,
        eventRegistration: eventRegistration,
        userId: this.userId
      } }).then(r => console.log(r));
  }
}

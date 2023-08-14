import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";
import {EventRegistration} from "../../models/event-registration";
import {combineLatest, mergeMap, skipWhile} from "rxjs";
import {UserProfileManagerService} from "../../../user-management";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {EventModule} from "../../models/event-module";
import {EventModuleManagerService} from "../../services/event-module-manager.service";

@Component({
  selector: 'testing-event-root',
  templateUrl: './testing-event-root.component.html',
  styleUrls: ['../testing-event.scss']
})
export class TestingEventRootComponent implements OnInit {
  registrations: EventRegistration[];
  currentlySelectedRegistration: EventRegistration;
  eventList: EventModule[];

  constructor(@Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
              public auth: AuthService,
              protected eventModuleManager: EventModuleManagerService,
              private userProfileManager: UserProfileManagerService) {}

  ngOnInit(): void {
    console.log(this.config);
    let events$ = this.eventModuleManager.getAllEvents();
    let user$ = this.userProfileManager.currentUser$;
    combineLatest([events$, user$]).pipe(
      skipWhile(combinedResults => combinedResults.some(result => result === undefined)),
      mergeMap(combinedResults => {
        const events = combinedResults[0];
        const user = combinedResults[1];
        this.eventList = events as EventModule[];
        return this.eventModuleManager.getAllRegistrations(user.fhirId, events);}
      )).subscribe({
      next: registrations => this.registrations = registrations
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
}

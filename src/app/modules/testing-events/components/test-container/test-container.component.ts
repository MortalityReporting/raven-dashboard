import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {EventRegistration} from "../../models/event-registration";
import {EventItem} from "../../models/event-item";
import {MatDialog} from "@angular/material/dialog";
import {DocumentWindowComponent} from "../document-window/document-window.component";

@Component({
  selector: 'testing-event-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.scss']
})
export class TestContainerComponent {

  eventItem: EventItem;
  eventRegistration: EventRegistration;
  userId: string;

  constructor(private router: Router, public dialog: MatDialog) {
    const state = this.router.getCurrentNavigation().extras.state
    this.eventItem = state['eventItem'];
    this.eventRegistration = state['eventRegistration'];
    this.userId = state['userId'];
    console.log(this.userId)
    // TODO: eventItem gives the code to base the switch statement on.
    // TODO: when handling the emitter from the child (e.g., search edrs) for a status change, catch it in this
    // component so that we can update the status. For now just worry about catching and logging since still need
    // to code the fhir resource update.
  }

  openDocumentWidow() {
    // TODO: Currently this approach to userId through binding doesn't allow proper page refresh as the previous pages might not have been initialized. Handle as an observable.
    const dialogRef = this.dialog.open(DocumentWindowComponent,
      {
        data: {
          userId: this.userId,
          registrationId: this.eventRegistration.fhirId
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

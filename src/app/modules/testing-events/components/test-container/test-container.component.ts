import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {EventRegistration} from "../../models/event-registration";
import {EventItem} from "../../models/event-item";
import {MatDialog} from "@angular/material/dialog";
import {DocumentWindowComponent} from "../document-window/document-window.component";
import {TestStatus} from "../../models/test-status";

@Component({
  selector: 'testing-event-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.scss']
})
export class TestContainerComponent {

  eventItem: EventItem;
  eventRegistration: EventRegistration;


  constructor(private router: Router, public dialog: MatDialog) {
    const state = this.router.getCurrentNavigation().extras.state
    this.eventItem = state['eventItem'];
    this.eventRegistration = state['eventRegistration'];
    // TODO: eventItem gives the code to base the switch statement on.
    // TODO: when handling the emitter from the child (e.g., search edrs) for a status change, catch it in this
    // component so that we can update the status. For now just worry about catching and logging since still need
    // to code the fhir resource update.
  }

  onTestCompleted(){
    this.eventItem.status = TestStatus.testSuccess;
  }

  openDocumentWidow() {
    const dialogRef = this.dialog.open(DocumentWindowComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

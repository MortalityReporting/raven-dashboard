import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {EventItem} from "../../models/event-item";
import {MatDialog} from "@angular/material/dialog";
import {DocumentWindowComponent} from "../document-window/document-window.component";
import {EventManagerService} from "../../services/event-manager.service";
import {Observable} from "rxjs";
import {Registration} from "../../models/registration";

@Component({
  selector: 'testing-event-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.scss']
})
export class TestContainerComponent {

  eventItem: EventItem;
  eventRegistration: Registration;
  userId: string;
  currentEventRegistration$: Observable<Registration>;

  constructor(private router: Router, public dialog: MatDialog,
              private eventModuleManager: EventManagerService
              ) {
    this.eventModuleManager.currentRegistration$.subscribe({
      next: value => {
        this.eventRegistration = value;
      }
    });
    const state = this.router.getCurrentNavigation().extras.state
    this.eventItem = state['eventItem'];

    this.userId = state['userId'];
    // TODO: eventItem gives the code to base the switch statement on.
    // TODO: when handling the emitter from the child (e.g., search edrs) for a status change, catch it in this
    // component so that we can update the status. For now just worry about catching and logging since still need
    // to code the fhir resource update.
  }

  onTestCompleted(){
    // TODO: Switch to status handler
    //this.eventItem.status = TestStatus.testSuccess;
  }

  openDocumentWidow() {
    // TODO: Currently this approach to userId through binding doesn't allow proper page refresh as the previous pages might not have been initialized. Handle as an observable.
    const dialogRef = this.dialog.open(DocumentWindowComponent,
      {
        data: {
          userId: this.userId,
          registrationId: this.eventRegistration.id,
          eventItemLinkId: this.eventItem.linkId
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

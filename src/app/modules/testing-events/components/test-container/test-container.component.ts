import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DocumentWindowComponent} from "../document-window/document-window.component";
import {EventManagerService} from "../../services/event-manager.service";
import {Registration} from "../../models/registration";
import {EventModule} from "../../models/event-module";
import {RegistrationDisplayItem} from "../../models/registration-display";
import {TestStatus} from "../../models/test-status";

@Component({
  selector: 'testing-event-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.scss']
})
export class TestContainerComponent {

  @Output() updateStatus = new EventEmitter<TestStatus>()
  @Output() exitTest = new EventEmitter()
  @Input() userId: string;
  currentRegistration: Registration;
  currentEvent: EventModule;
  @Input() registrationDisplayItem: RegistrationDisplayItem;

  constructor(private router: Router, public dialog: MatDialog,
              private eventManager: EventManagerService
              ) {
    // const state = this.router.getCurrentNavigation().extras.state
    // this.registrationDisplayItem = state['displayItem'];
    // this.userId = state['userId'];

    const currentRegistration$ = this.eventManager.currentRegistration$;
    const currentEvent$ = this.eventManager.currentEvent$;

    currentRegistration$.subscribe({
      next: value => {this.currentRegistration = value}
    });
    currentEvent$.subscribe({
      next: value => {this.currentEvent = value}
    });
  }

  onTestCompleted(){
    // TODO: Switch to status handler
    this.onUpdateStatus(TestStatus.complete);
  }

  openDocumentWidow() {
    // TODO: Currently this approach to userId through binding doesn't allow proper page refresh as the previous pages might not have been initialized. Handle as an observable.
    const dialogRef = this.dialog.open(DocumentWindowComponent,
      {
        data: {
          userId: this.userId,
          registrationId: this.currentRegistration.id,
          eventItemLinkId: this.registrationDisplayItem.linkId
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onUpdateStatus(data: any) {
    console.log(data)
    this.updateStatus.emit(data);
  }

  onExitTest() {
    this.exitTest.emit();
  }
}

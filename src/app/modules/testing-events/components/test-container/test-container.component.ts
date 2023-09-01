import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DocumentWindowComponent} from "../document-window/document-window.component";
import {EventManagerService} from "../../services/event-manager.service";
import {Registration} from "../../models/registration";
import {EventModule} from "../../models/event-module";
import {RegistrationDisplayItem} from "../../models/registration-display";

@Component({
  selector: 'testing-event-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.scss']
})
export class TestContainerComponent {

  userId: string;
  currentRegistration: Registration;
  currentEvent: EventModule;
  registrationDisplayItem: RegistrationDisplayItem;

  constructor(private router: Router, public dialog: MatDialog,
              private eventManager: EventManagerService
              ) {
    const state = this.router.getCurrentNavigation().extras.state
    this.registrationDisplayItem = state['displayItem'];
    this.userId = state['userId'];

    const currentRegistration$ = this.eventManager.currentRegistration$;
    const currentEvent$ = this.eventManager.currentEvent$;

    currentRegistration$.subscribe({
      next: value => {this.currentRegistration = value}
    });
    currentEvent$.subscribe({
      next: value => {this.currentEvent = value}
    });
    // combineLatest([currentRegistration$, currentEvent$]).pipe(
    //   skipWhile(combinedResults => combinedResults.some(result => result === undefined)),
    //   map(combinedResults => {
    //     this.currentRegistration = combinedResults[0];
    //     this.currentEvent = combinedResults[1];
    //     let itemDisplay: ItemDisplay = new Regi();
    //     itemDisplay.eventTitle = this.currentEvent.title;
    //     console.log(this.currentEvent);
    //     const eventItem = this.currentEvent.items.find((eventItem: EventItem) => eventItem.linkId === this.linkId);
    //     console.log(eventItem)
    //     const regItem: QuestionnaireResponseItem = this.currentRegistration.item.find(item => item.linkId === this.linkId);
    //     itemDisplay.testName = eventItem.name;
    //     itemDisplay.testCode = eventItem.code;
    //     itemDisplay.testStatus = regItem.answer[0].valueCoding.code;
    //     return itemDisplay;
    //   })).subscribe({
    //   next: (value: ItemDisplay) => {
    //     this.itemDisplay = value;
    //   }
    // })

    // TODO: linkId tracks to eventItem gives the code to base the switch statement on.
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
          registrationId: this.currentRegistration.id,
          eventItemLinkId: this.registrationDisplayItem.linkId
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

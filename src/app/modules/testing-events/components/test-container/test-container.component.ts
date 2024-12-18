import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DocumentWindowComponent} from "../document-window/document-window.component";
import {EventManagerService} from "../../services/event-manager.service";
import {Registration} from "../../models/registration";
import {EventModule} from "../../models/event-module";
import {RegistrationDisplayItem} from "../../models/registration-display";
import {TestStatusCodes} from "../../models/test-status";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {UpdateAction} from "../../models/update-action";
import {filter} from "rxjs/operators";
import {UtilsService} from "../../../../service/utils.service";

@Component({
    selector: 'testing-event-test-container',
    templateUrl: './test-container.component.html',
    styleUrls: ['../testing-event.scss'],
    standalone: false
})
export class TestContainerComponent {

  @Output() updateStatus = new EventEmitter<UpdateAction>()
  @Output() exitTest = new EventEmitter()
  @Input() userId: string;
  currentRegistration: Registration;
  currentEvent: EventModule;
  @Input() registrationDisplayItem: RegistrationDisplayItem;


  constructor(private router: Router, public dialog: MatDialog,
              private eventManager: EventManagerService,
              private utilsService: UtilsService,
              @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
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
    this.onUpdateStatus(TestStatusCodes.complete);
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

    dialogRef.afterClosed().pipe(
      filter((result: any) => result.file !== undefined)
    ).subscribe(result => {
      this.startUpload(result.file);
    });
  }

  startUpload(file: File) {
    let upload$ = this.eventManager.uploadDocument(file, this.currentEvent.machineReadableName);
    upload$.subscribe({
      next: value => {
        this.utilsService.showSuccessMessage("The file was uploaded successfully");
        if (value.type === 4) {
          const attachment = `${value['body']['bucket']}/${value['body']['filename']}`
          this.onUpdateStatus(TestStatusCodes.reviewPending, attachment)
        }
      },
      error: err => {
        this.utilsService.showErrorMessage("An error occurred while attempting to upload the file to the server");
        console.error(err)
      }
    })
    // this.eventManager.uploadDocument(file, this.userId, this.currentRegistration.id).pipe(
    //   mergeMap( (documentReference: any) => {
    //       console.log(documentReference)
    //       //const update$ = this.eventManager.updateTestStatus(this.data.eventItemLinkId, TestStatus.reviewPending, documentReference)
    //       //return update$;
    //       return documentReference;
    //     }
    //   )
    // ).subscribe({
    //   next: value => {
    //     console.log(value);
    //   }
    // })
  }

  onUpdateStatus(status: any, attachment?: string) {
    console.log(status)
    console.log(attachment)
    let data: UpdateAction = {status: status}
    if (attachment) {
      data.attachment = attachment
    }
    this.updateStatus.emit(data); //TODO: If the test status up date is before the emit, emit doesn't fire?
    this.registrationDisplayItem.testStatus = status;
  }

  onExitTest() {
    this.exitTest.emit();
  }
}

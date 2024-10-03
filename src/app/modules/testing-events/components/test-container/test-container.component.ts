import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {EventManagerService} from "../../services/event-manager.service";
import {Registration} from "../../models/registration";
import {EventModule} from "../../models/event-module";
import {RegistrationDisplayItem} from "../../models/registration-display";
import {TestStatusCodes} from "../../models/test-status";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {UpdateAction} from "../../models/update-action";
import {filter} from "rxjs/operators";
import {UtilsService} from "../../../../service/utils.service";
import {FileUploaderComponent} from "../../../../components/widgets/file-uploader/file-uploader.component";
import {UserProfile} from "../../../user-management/models/user-profile";

@Component({
  selector: 'testing-event-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['../testing-event.scss']
})
export class TestContainerComponent {

  @Output() updateStatus = new EventEmitter<UpdateAction>();
  @Output() exitTest = new EventEmitter();
  currentRegistration: Registration;
  currentEvent: EventModule;
  @Input() registrationDisplayItem: RegistrationDisplayItem;
  @Input() user!: UserProfile | null;



  constructor(private router: Router, public dialog: MatDialog,
              private eventManager: EventManagerService,
              private utilsService: UtilsService,
              @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
              ) {
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
    const dialogRef = this.dialog.open(FileUploaderComponent,
      {
        data: {
          archiveName: `${this.user.name}_${(new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)}.zip`,
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

import {Component, Inject} from '@angular/core';
import {DashboardApiInterfaceService} from "../../../dashboard-api";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {EventManagerService} from "../../services/event-manager.service";
import {mergeMap, of} from "rxjs";
import {TestStatus} from "../../models/test-status";

@Component({
  selector: 'app-document-window',
  templateUrl: './document-window.component.html',
  styleUrls: ['./document-window.component.scss']
})
export class DocumentWindowComponent {
  fileName: string = "No File Selected";
  file: File = undefined;
  preview: any = undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      registrationId: string, userId: string, eventItemLinkId: string
    },
    private dashboardApi: DashboardApiInterfaceService,
    private eventManager: EventManagerService
  ) {
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.preview = event.target.result;
    }
    this.file = file;
    this.fileName = file.name;
  }

  onClickUpload() {
    // this.eventManager.uploadDocument(this.file, this.data.userId, this.data.registrationId).pipe(
    //   mergeMap( (documentReference: any) => {
    //     console.log(documentReference)
    //     //const update$ = this.eventManager.updateTestStatus(this.data.eventItemLinkId, TestStatus.reviewPending, documentReference)
    //     //return update$;
    //     return of("")
    //     }
    //   )
    // ).subscribe({
    //   next: value => {
    //     console.log(value);
    //   }
    // })
  }
}

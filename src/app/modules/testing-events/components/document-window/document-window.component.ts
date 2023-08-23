import {Component, Inject, SecurityContext} from '@angular/core';
import {DashboardApiInterfaceService} from "../../../../service/dashboard-api-interface.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {EventModuleManagerService} from "../../services/event-module-manager.service";

@Component({
  selector: 'app-document-window',
  templateUrl: './document-window.component.html',
  styleUrls: ['./document-window.component.scss']
})
export class DocumentWindowComponent {
  fileName: string = "";
  file: File = undefined;
  preview: any = undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {registrationId: string, userId: string},
    private dashboardApi: DashboardApiInterfaceService,
    private eventManager: EventModuleManagerService
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
    this.eventManager.uploadDocument(this.file, this.data.userId, this.data.registrationId).subscribe({
      next: value => {
        console.log(value);
      }
    })
  }
}

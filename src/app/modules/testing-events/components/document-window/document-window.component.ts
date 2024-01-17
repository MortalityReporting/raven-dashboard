import {Component, Inject} from '@angular/core';
import {DashboardApiInterfaceService} from "../../../dashboard-api";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EventManagerService} from "../../services/event-manager.service";
import {mergeMap} from "rxjs";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";

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
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    public dialogRef: MatDialogRef<DocumentWindowComponent>,
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
    this.dialogRef.close({file: this.file})
  }
}

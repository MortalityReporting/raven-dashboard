import {Component, Inject} from '@angular/core';
import {DashboardApiInterfaceService} from "../../../dashboard-api";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EventManagerService} from "../../services/event-manager.service";
import {mergeMap} from "rxjs";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";

@Component({
    selector: 'app-document-window',
    templateUrl: './document-window.component.html',
    styleUrls: ['./document-window.component.scss'],
    standalone: false
})
export class DocumentWindowComponent {
  fileName: string = "No File Selected";
  file: File = undefined;
  preview: any = undefined;
  isPreviewAvailable: boolean = false;

  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    public dialogRef: MatDialogRef<DocumentWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      registrationId: string, userId: string, eventItemLinkId: string
    },
  ) {
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    // image/jpeg image/png
    if(this.file.type == "image/png" || this.file.type == "image/jpeg"){
      reader.onload = (event) => {
        this.preview = event.target.result;
      }
      this.isPreviewAvailable = true;
    }
    else {
      this.isPreviewAvailable = false;
    }
  }

  onClickUpload() {
    this.dialogRef.close({file: this.file});
    this.isPreviewAvailable = false;
  }
}

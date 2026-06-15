import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogActions, MatDialogContent, MatDialogClose } from "@angular/material/dialog";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import { MatDivider } from '@angular/material/list';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-document-window',
    templateUrl: './document-window.component.html',
    styleUrls: ['./document-window.component.scss'],
    imports: [MatDialogTitle, MatDivider, MatDialogActions, MatButton, MatIcon, CdkScrollable, MatDialogContent, MatDialogClose]
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

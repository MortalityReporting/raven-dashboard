import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DragAndDropDirective} from "../../directives/drag-and-drop.directive";
import {DashboardApiInterfaceService} from "../../../../dashboard-api";

export interface MultiFileUploadDialogData {
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  width?: string;
}

@Component({
  selector: 'app-multi-file-upload',
  imports: [
    MatIcon,
    MatButton,
    DragAndDropDirective
  ],
  templateUrl: './multi-file-upload.component.html',
  styleUrl: './multi-file-upload.component.scss'
})
export class MultiFileUploadComponent {
  @ViewChild('attachments') attachment: ElementRef;
  constructor(
    @Inject('workflowSimulatorConfig') public config: ModuleHeaderConfig,
    @Inject(MAT_DIALOG_DATA) public data: {
      registrationId: string,
      userId: string,
      eventItemLinkId: string,
      width: string
      height: string
    },
    private dashboardApiInterfaceService: DashboardApiInterfaceService
  ) {
  }

  fileList: File[] = [];
  isLoading = false;

  onFileChanged(event: any) {
    this.isLoading = true;
    Array.from(event.target.files).forEach(selectedFile => {
      if (!this.fileList.some(file => file.name === (selectedFile as File).name)) {
        this.fileList.push(selectedFile as File);
      }
    });
    console.log(this.fileList)
    this.isLoading = false;
  }

  removeSelectedFile(index: number) {
    // Delete the item from fileNames list
    this.fileList.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
  }

  selectFiles(incomingFiles: File[]) {
    //TODO handle incorrect file types and file size here. Need clear requirements to implement
    console.log(this.fileList)
  }
}

export function openMultiFileUpload(dialog: MatDialog, dialogData: MultiFileUploadDialogData) {

  const config = new MatDialogConfig();
  console.log(dialogData);

  config.autoFocus = true;
  config.data = {
    ...dialogData
  }

  const dialogRef = dialog.open(MultiFileUploadComponent, config.data);

  return dialogRef.afterClosed();
}

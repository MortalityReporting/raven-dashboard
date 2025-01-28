import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {DragAndDropDirective} from "../../directives/drag-and-drop.directive";
import JSZip from "jszip";

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
    private dialogRef: MatDialogRef<any>,
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
    this.fileList = [...this.fileList, ...incomingFiles];
  }

  async zipFiles(fileList: File[], archiveName: string): Promise<File> {
    let zip = new JSZip();
    fileList.forEach(file => zip.file(file.name, file));
    const content = await zip.generateAsync({ type: 'blob' });
    return new File([content], archiveName, { type: 'application/zip' });
  }

  onUploadFiles(){
    if(this.fileList.length == 0){
      console.warn("No files selected for upload")
    }
    else if(this.fileList.length == 1){
      //one file, no need to zip it
      this.dialogRef.close({file: this.fileList[0]})
    }
    else {
      this.zipFiles(this.fileList, 'archive.zip') //we can append to the name whatever we want and pass it to dialog data
        .then(archive => this.dialogRef.close({file: archive}))
    }

  }

  onClose() {
    this.fileList = [];
    this.dialogRef.close();
  }
}


export function openMultiFileUpload(dialog: MatDialog, dialogData: MultiFileUploadDialogData) {

  const config = new MatDialogConfig();

  config.autoFocus = true;
  config.data = {
    ...dialogData
  }

  const dialogRef = dialog.open(MultiFileUploadComponent, config.data);

  return dialogRef.afterClosed();
}

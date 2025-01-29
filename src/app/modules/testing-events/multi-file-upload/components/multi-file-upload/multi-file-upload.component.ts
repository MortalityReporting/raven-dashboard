import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {DragAndDropDirective} from "../../directives/drag-and-drop.directive";
import JSZip, {file} from "jszip";
import {FilesizePipe} from "../../pipes/filesize.pipe";
import {FilenameShortenerPipe} from "../../pipes/filename-shortener.pipe";
import {MatError} from "@angular/material/form-field";
import {NgClass} from "@angular/common";


export interface MultiFileUploadDialogData {
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  width?: string;
}

/*
Allowed extensions list
  zip, pdf, doc, docx, xls, xlsx, ppt, pptx, rtf, txt, png, jpg, jpeg
*/

@Component({
  selector: 'app-multi-file-upload',
  imports: [
    MatIcon,
    MatButton,
    DragAndDropDirective,
    FilesizePipe,
    FilenameShortenerPipe,
    MatError,
    NgClass,
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
  MAX_TOTAL_SIZE: number = 2*(1024 * 1024);
  totalFileSize = 0;

  getTotalFileSize(fileList: File[]) {
    if (!fileList || fileList.length === 0) {
      return 0;
    }
    return fileList.reduce((acc, file) => acc + file.size, 0);
  }

  setTotalFileSize(){
    this.totalFileSize = this.fileList.reduce((acc, file) => acc + file.size, 0);
  }

  onFileChanged(event: any) {
    this.isLoading = true;
    Array.from(event.target.files).forEach(selectedFile => {
      if (!this.fileList.some(file => file.name === (selectedFile as File).name)) {
        this.fileList.push(selectedFile as File);
        this.setTotalFileSize();
      }
    });
    this.isLoading = false;
  }

  removeSelectedFile(index: number) {
    // Delete the item from fileNames list
    this.fileList.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
    this.setTotalFileSize();
  }

  selectFiles(incomingFiles: File[]) {
    //TODO handle incorrect file types and file size here. Need clear requirements to implement
    this.fileList = [...this.fileList, ...incomingFiles];
    this.setTotalFileSize();
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
    else {
      this.zipFiles(this.fileList, 'archive.zip') //we can append to the name whatever we want and pass it to dialog data
        .then(archive => {
          this.dialogRef.close({file: archive})
        })
    }
  }

  onClose() {
    this.fileList = [];
    this.dialogRef.close();
  }

  protected readonly file = file;
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

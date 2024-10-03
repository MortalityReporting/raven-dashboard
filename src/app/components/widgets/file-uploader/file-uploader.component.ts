import {AfterViewInit, Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog, MatDialogActions,
  MatDialogConfig,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import JSZip, {file, files} from "jszip";
import {TotalFileSizePipe} from "./pipes/total-file-size.pipe";
import {MatIcon} from "@angular/material/icon";
import {NgClass} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatTableModule
} from "@angular/material/table";
import {FileSizePipe} from "./pipes/file-size.pipe";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatIcon,
    NgClass,
    MatButton,
    MatTableModule,
    FileSizePipe,
    MatDialogActions,
    MatTooltip,
    TotalFileSizePipe,
  ],
  standalone: true,
  providers: [TotalFileSizePipe]
})

export class FileUploaderComponent implements AfterViewInit{
  files: File[] = [];
  dataSource = [];
  displayedColumns: string[] = ['fileName', 'fileSize', 'action'];
  warningMessage: string = '';
  maxTotalSize: number = 5242880 ; //5MB
  maxTotalSizeWarningMessage = '';
  protected readonly Math = Math;

  constructor(private dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private dialogData: any, private totalFileSize: TotalFileSizePipe) {}

  ngAfterViewInit(): void {
    this.maxTotalSize = this.dialogData.maxTotalSize || this.maxTotalSize;
    this.maxTotalSizeWarningMessage = `You have exceeded the maximum allowed size of ${ this.maxTotalSize / (1024 * 1024) }MB`
  }

  onFileSelected(event) {
    this.files = Array.from(event.target.files);
    this.dataSource = this.files;
    this.warningMessage = this.totalFileSize.transform(this.files) > this.maxTotalSize ? this.maxTotalSizeWarningMessage: '';
  }

  removeFile(fileToRemove: File) {
    this.files = this.files.filter(file => file.name != fileToRemove.name);
    this.dataSource = this.files;
    this.warningMessage = this.totalFileSize.transform(this.files) > this.maxTotalSize ? this.maxTotalSizeWarningMessage: '';
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.files = Array.from(event.dataTransfer?.files);
    this.dataSource=this.files;
    this.warningMessage = this.totalFileSize.transform(this.files) > this.maxTotalSize ? this.maxTotalSizeWarningMessage: '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  uploadZip(files: File[]) {
    this.warningMessage = '';
    if (files.length == 0) {
      // add message to the user here
      console.warn('No files selected.');
      this.warningMessage = "Please select file(s) to upload."
    } else {
      const zip = new JSZip();

      // Add files to the zip
      for (const file of files) {
        zip.file(file.name, file);
      }
      const archiveName = this.dialogData.archiveName || 'archive.zip';
      zip.generateAsync({ type: 'blob' }).then(zipFile => {
        let file = new File([zipFile as BlobPart], archiveName, {type: 'application/zip'}
      )
        this.dialogRef.close({file: file})
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

export function openFileUpload(dialog: MatDialog, dialogData: any) {

  const config = new MatDialogConfig();

  config.autoFocus = true;
  config.data = {
    ...dialogData
  }

  const dialogRef = dialog.open(FileUploaderComponent, config);

  return dialogRef.afterClosed();


}

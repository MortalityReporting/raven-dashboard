import {Component} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import JSZip from "jszip";
import {HttpClient} from "@angular/common/http";
import {from, switchMap} from "rxjs";


@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})

export class FileUploaderComponent {
  files: File[] = [];
  dataSource = [];
  displayedColumns: string[] = ['fileName', 'fileSize', 'action'];
  protected readonly Math = Math;
  errorMessage: string ='';
  warningMessage: string = '';

  constructor(private http: HttpClient, private dialogRef: MatDialogRef<any>) {}

  onFileSelected(event) {
    this.files = Array.from(event.target.files);
    this.dataSource = this.files;
  }

  removeFile(fileToRemove: File) {
    this.files = this.files.filter(file => file.name != fileToRemove.name);
    this.dataSource = this.files;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.files = Array.from(event.dataTransfer?.files);
    this.dataSource=this.files;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  uploadZip(files: File[]) {
    this.warningMessage = '';
    this.errorMessage = '';
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

      // Convert JSZip promise to observable
      from(zip.generateAsync({type: 'blob'}))
        .pipe(
          switchMap((blob) => {
            const formData = new FormData();
            formData.append('zipFile', blob, 'archive.zip');
            return this.http.post('your-api-endpoint', formData);
          })
        )
        .subscribe({
          next: (response) => {
            //render success message to the user
            console.log('Upload successful!', response);
          },
          error: (error) => {
            //render error to the user
            console.error('Upload failed', error);
            this.errorMessage = "Error uploading the file(s)."
          },
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

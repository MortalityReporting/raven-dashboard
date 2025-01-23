import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-multi-file-upload',
  imports: [
    MatIconButton,
    MatIcon,
    MatButton
  ],
  templateUrl: './multi-file-upload.component.html',
  styleUrl: './multi-file-upload.component.scss'
})
export class MultiFileUploadComponent {
  @ViewChild('attachments') attachment: ElementRef;

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
}

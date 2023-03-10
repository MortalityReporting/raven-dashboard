import {Component, Inject, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  content: any; // The content of the modal (the modal should render html)
  private sanitizer: DomSanitizer; // We meed tje sanitizer to render html content

  title: string = null; // The title of the modal

  contentType: string; // Different types of content require different rendering. See the html code.

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  ngOnInit(): void {
    this.content = this.dialogData.content;
    this.contentType = this.dialogData.contentType;
    if(this.contentType == 'html'){
      this.content = this.sanitizer.bypassSecurityTrustHtml(this.content);
    }
    this.title = this.dialogData.title;
  }
}

export function openModal(dialog: MatDialog, dialogData: any) {

  const config = new MatDialogConfig();

  config.autoFocus = true;
  config.data = {
    ...dialogData
  }

  const dialogRef = dialog.open(ModalComponent, config);

  return dialogRef.afterClosed();
}

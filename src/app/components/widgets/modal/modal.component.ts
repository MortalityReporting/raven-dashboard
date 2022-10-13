import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  content: any;
  title: string = null;
  private sanitizer: DomSanitizer;
  contentType: string;

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

import {Component, Inject, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import {UtilsService} from "../../../service/utils.service";
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { MatIcon } from '@angular/material/icon';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatTooltip, CdkCopyToClipboard, MatIcon, MatDialogClose, JsonPipe]
})
export class ModalComponent implements OnInit {

  content: any; // The content of the modal (the modal should render html)
  private sanitizer: DomSanitizer; // We meed tje sanitizer to render html content

  title: string = null; // The title of the modal

  contentType: string; // Different types of content require different rendering. See the html code.
  protected readonly JSON = JSON;
  primaryColor: string;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  ngOnInit(): void {
    this.content = this.dialogData.content;
    this.contentType = this.dialogData.contentType;
    if(this.contentType == 'html'){
      this.content = this.sanitizer.bypassSecurityTrustHtml(this.content);
    }
    this.title = this.dialogData.title;
    this.primaryColor = this.dialogData.primaryColor;
  }

  onCopyToClipboard() {
    this.utilsService.showSuccessMessage("Content copied to clipboard.")
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

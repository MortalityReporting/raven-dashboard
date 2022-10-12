import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  content: string = "Do you want to continue?";
  title: string = null;

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  ngOnInit(): void {
    this.content = this.dialogData.content;
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

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-conformation-dialog',
  templateUrl: './conformation-dialog.component.html',
  styleUrls: ['./conformation-dialog.component.scss']
})
export class ConformationDialogComponent implements OnInit {

  content: string = "Do you want to continue?";
  title: string = null;
  primaryActionBtnTitle: string = "Yes"; // Is the action we want to take. For example Save, Delete
  secondaryActionBtnTitle: string = "No"; // Permits the user to exist without executing the primary action. For example Cancel
  isPrimaryButtonLeft: boolean = false; // Indicates the position of the primary action. If the primary action is on the left, the default button is the secondary action.

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  onSecondaryClick() {
    this.dialogRef.close('secondaryAction');
  }

  onDefaultClick() {
    this.dialogRef.close('primaryAction');
  }

  ngOnInit(): void {
    this.content = this.dialogData.content;
    this.title = this.dialogData.title;
    this.primaryActionBtnTitle = this.dialogData.primaryActionBtnTitle;
    this.secondaryActionBtnTitle = this.dialogData.secondaryActionBtnTitle;
    this.isPrimaryButtonLeft = this.dialogData.isPrimaryButtonLeft;
  }
}


export function openConformationDialog(dialog: MatDialog, dialogData: any) {

  const config = new MatDialogConfig();

  config.autoFocus = true;
  config.width = dialogData.width ?? "20em";
  config.height = dialogData.height ?? "10em";

  config.data = {
    ...dialogData
  }

  const dialogRef = dialog.open(ConformationDialogComponent, config);

  return dialogRef.afterClosed();
}


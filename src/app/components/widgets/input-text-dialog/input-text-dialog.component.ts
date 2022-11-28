import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-input-text-dialog',
  templateUrl: './input-text-dialog.component.html',
  styleUrls: ['./input-text-dialog.component.css']
})
export class InputTextDialogComponent implements OnInit {

  title: string = null;
  primaryActionBtnTitle: string = "Save"; // Is the action we want to take. For example Save, Delete
  secondaryActionBtnTitle: string = "Cancel"; // Permits the user to exist without executing the primary action. For example Cancel
  isPrimaryButtonLeft: boolean = false; // Indicates the position of the primary action. If the primary action is on the left, the default button is the secondary action.
  dialogForm = new FormGroup({
    content: new FormControl(null, [Validators.required])
  });

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  onCancel() {
    this.dialogRef.close();
    this.dialogForm.reset();
  }

  onSave() {
    this.dialogRef.close(this.dialogForm.value);
    this.dialogForm.reset();
  }

  ngOnInit(): void {

    if(this.dialogData.content){
      this.dialogForm.controls['content'].patchValue(this.dialogData.content);
    };

    this.title = this.dialogData.title;
    this.primaryActionBtnTitle = this.dialogData.primaryActionBtnTitle;
    this.secondaryActionBtnTitle = this.dialogData.secondaryActionBtnTitle;
    this.isPrimaryButtonLeft = this.dialogData.isPrimaryButtonLeft;
  }

  onSubmit() {
    if(this.dialogForm.valid){
      this.onSave();
    }
  }
}


export function openInputTextDialog(dialog: MatDialog, dialogData: any) {

  const config = new MatDialogConfig();

  config.autoFocus = true;
  config.width = dialogData.width ?? "80%";
  config.height = dialogData.height ?? "80%";

  config.data = {
    ...dialogData
  }

  const dialogRef = dialog.open(InputTextDialogComponent, config);

  return dialogRef.afterClosed();
}

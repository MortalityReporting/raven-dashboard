import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {JsonValidator} from "../../../reactive-form-validators/json-validator";

@Component({
  selector: 'app-input-text-dialog',
  templateUrl: './input-text-dialog.component.html',
  styleUrls: ['./input-text-dialog.component.scss']
})
export class InputTextDialogComponent implements OnInit {

  title: string = null;
  primaryActionBtnTitle: string; // Is the action we want to take. For example Save, Delete
  secondaryActionBtnTitle: string; // Permits the user to exist without executing the primary action. For example Cancel
  isPrimaryButtonLeft: boolean = false; // Indicates the position of the primary action. If the primary action is on the left, the default button is the secondary action.
  dialogForm = new FormGroup({
    content: new FormControl(null)
  });
  inputLabelText: string = 'Paste or enter content here';
  validatorErrors: string;
  validatorErrorTypes: any[]; // We can use this to inject the error types used by the validators

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  onCancel() {
    this.dialogRef.close();
    this.dialogForm.reset();
  }

  onSave() {
    this.dialogRef.close(this.dialogForm.controls['content'].value);
    this.dialogForm.reset();
  }

  ngOnInit(): void {

    if(this.dialogData.content){
      this.dialogForm.controls['content'].patchValue(this.dialogData.content);
    }

    if(this.dialogData.formValidators){
      // Inject the validators
      this.dialogForm.controls['content'].setValidators(this.dialogData.formValidators);
      this.dialogForm.controls['content'].updateValueAndValidity();
      this.validatorErrorTypes = this.dialogData.formValidationTypes
    }

    this.title = this.dialogData.title;
    this.primaryActionBtnTitle = this.dialogData.primaryActionBtnTitle ?? 'Save';
    this.secondaryActionBtnTitle = this.dialogData.secondaryActionBtnTitl ?? 'Cancel';
    this.isPrimaryButtonLeft = this.dialogData.isPrimaryButtonLeft;
    this.inputLabelText = this.dialogData.inputLabelText ?? 'Paste or enter content here';
  }

  onSubmit() {
    if(this.dialogForm.valid){
      this.onSave();
      this.validatorErrors = null;
    }
    else {
      this.validatorErrors = this.getValidationErrors(this.dialogForm.controls['content'].errors, this.validatorErrorTypes);
    }

  }

  getValidationErrors(errors: ValidationErrors, errorTypes: any[]): string {
    if(!errors || !errorTypes){
      console.error("No errors or error type parameters present.");
      return null;
    }
    const errorName = Object.keys(errors)[0];
    const result = errorTypes.find(element => element.name === errorName)?.display;
    if(result) {
      return result;
    }
    else if(errorName){
      console.error("Unable to find error with name " + errorName);
      return "Validation Error Produced";
    }
    else {
      console.log("The validation did not produce any errors")
      return null;
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

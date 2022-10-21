import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {UtilsService} from "../../../../service/utils.service";

@Component({
  selector: 'case-comparison-dialog',
  templateUrl: 'case-comparison-dialog.component.html',
  styleUrls: ['./case-comparison-dialog.component.css'],
})
export class CaseComparisonDialogComponent {
  text: string = undefined;
  originalText: string = undefined;
  errorMessage: string;

  constructor(
    @Inject( MAT_DIALOG_DATA) public data: Object,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<CaseComparisonDialogComponent>) {
      if (data) {
        this.text = JSON.stringify(data, null, 2);
        this.originalText = JSON.stringify(data, null, 2);
    }
  }

  onTextAreaChanged( event: any ) {
    this.text = (event.target as any).value;
    console.log( this.text );
    this.errorMessage = '';
  }

  onClearButtonClick() {
    this.text = "";
    this.errorMessage = '';
  }

  onCancelButtonClick() {
    this.dialogRef.close(this.originalText);
    this.errorMessage = '';
  }

  onSaveButtonClick() {
    if(!this.text){
      this.errorMessage = "No resource entered.";
      console.error("No resource entered.");
      return;
    }
    else if(!this.utilsService.isJsonString(this.text)){
      this.errorMessage = "Invalid JSON.";
      console.error("Invalid json.");
      return;
    }
    const parsed =  JSON.parse(this.text.trim());
    if(!parsed.resourceType || parsed.resourceType !== "Bundle"){
      this.errorMessage = "Resource type must be Bundle.";
      console.error("Resource type must be Bundle.");
    }
    else {
      this.dialogRef.close(this.text);
      this.errorMessage = '';
    }
  }
}

import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import {UtilsService} from "../../../../service/utils.service";

@Component({
  selector: 'record-comparison-container-dialog',
  templateUrl: 'record-comparison-dialog.component.html',
  styleUrls: ['./record-comparison-dialog.component.scss'],
})
export class RecordComparisonDialogComponent {
  text: string = undefined;
  originalText: string = undefined;
  errorMessage: string;

  constructor(
    @Inject( MAT_DIALOG_DATA) public data: Object,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<RecordComparisonDialogComponent>) {
    dialogRef.disableClose =true;
      if (data) {
        this.text = JSON.stringify(data, null, 2);
        this.originalText = JSON.stringify(data, null, 2);
    }
  }

  onTextAreaChanged( event: any ) {
    this.text = (event.target as any).value;
    this.errorMessage = '';
  }

  onClose() {
    this.text = "";
    this.errorMessage = '';
    this.dialogRef.close(this.originalText);
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

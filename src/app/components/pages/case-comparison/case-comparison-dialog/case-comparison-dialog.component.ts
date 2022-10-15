import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'case-comparison-dialog',
  templateUrl: 'case-comparison-dialog.html',
  styleUrls: ['./case-comparison-dialog.css'],
})
export class CaseComparisonDialogComponent {
  text: string = undefined;
  
  constructor(
    @Inject( MAT_DIALOG_DATA) public data: Object,
      public dialogRef: MatDialogRef<CaseComparisonDialogComponent>) {
        if (data) {
          this.text = JSON.stringify(data, null, 2);
      }
  }

  onTextAreaChanged( event: any ) {    
    this.text = (event.target as any).value;
  }

  onClearButtonClick() {
    this.dialogRef.close(undefined);
  } 
  
  onSaveButtonClick() {
    this.dialogRef.close(this.text);
  }
}
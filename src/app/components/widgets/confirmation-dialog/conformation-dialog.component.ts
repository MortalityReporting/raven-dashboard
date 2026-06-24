import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {DialogData} from "./dialog-data";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConformationDialogComponent {

  private dialogRef = inject(MatDialogRef<any>);
  private dialogData = inject<DialogData>(MAT_DIALOG_DATA);

  data: DialogData = {
    title: this.dialogData.title ?? "",
    content: this.dialogData.content ?? "Do you want to continue?",
    primaryActionBtnTitle: this.dialogData.primaryActionBtnTitle ?? "Yes",
    secondaryActionBtnTitle: this.dialogData.secondaryActionBtnTitle ?? "No",
    width: this.dialogData.width ?? '4em',
    height: this.dialogData.height ?? '4em',
    isPrimaryButtonLeft: this.dialogData.isPrimaryButtonLeft ?? false
  };

  onSecondaryClick(): void {
    this.dialogRef.close('secondaryAction');
  }

  onDefaultClick(): void {
    this.dialogRef.close('primaryAction');
  }
}

export function openConfirmationDialog(dialog: MatDialog, dialogData?: DialogData) {

  const config = new MatDialogConfig();

  config.autoFocus = true;
  config.width = dialogData?.width
  config.height = dialogData?.height;

  config.data = {
    ...dialogData
  }

  const dialogRef = dialog.open(ConformationDialogComponent, config);

  return dialogRef.afterClosed();
}

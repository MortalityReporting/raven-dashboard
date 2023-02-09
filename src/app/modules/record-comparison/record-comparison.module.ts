import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CaseComparisonComponent} from "./components/case-comparison/case-comparison.component";
import {
  CaseComparisonContentComponent
} from "./components/case-comparison/case-comparison-content/case-comparison-content.component";
import {
  CaseComparisonContentFieldComponent
} from "./components/case-comparison/case-comparison-content-field/case-comparison-content-field.component";
import {
  CaseComparisonDialogComponent
} from "./components/case-comparison/case-comparison-dialog/case-comparison-dialog.component";
import {ReferenceDocumentService} from "./services/reference-document.service";



@NgModule({
  declarations: [
    CaseComparisonComponent,
    CaseComparisonContentComponent,
    CaseComparisonContentFieldComponent,
    CaseComparisonDialogComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    ReferenceDocumentService
  ]
})
export class RecordComparisonModule { }

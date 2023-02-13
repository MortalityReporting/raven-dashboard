import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecordComparisonContainerComponent} from "./components/record-comparison-container/record-comparison-container.component";
import {
  RecordComparisonContentComponent
} from "./components/record-comparison-content/record-comparison-content.component";
import {
  RecordComparisonContentFieldComponent
} from "./components/record-comparison-content-field/record-comparison-content-field.component";
import {
  RecordComparisonDialogComponent
} from "./components/record-comparison-dialog/record-comparison-dialog.component";
import {ReferenceDocumentService} from "./services/reference-document.service";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";



@NgModule({
  declarations: [
    RecordComparisonContainerComponent,
    RecordComparisonContentComponent,
    RecordComparisonContentFieldComponent,
    RecordComparisonDialogComponent,
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,

  ],
  providers: [
    ReferenceDocumentService
  ],
  entryComponents: [RecordComparisonDialogComponent],
})
export class RecordComparisonModule { }

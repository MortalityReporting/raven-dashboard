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
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";



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
    ]
})
export class RecordComparisonModule { }

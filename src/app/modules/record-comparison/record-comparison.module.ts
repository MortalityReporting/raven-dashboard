import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
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
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import { RecordComparisonComponent } from './components/record-comparison.component';
import { SetRecordsComponent } from './components/set-records/set-records.component';
import { EntriesComponent } from './components/entries/entries.component';
import { DetailsComponent } from './components/details/details.component';

@NgModule({
    declarations: [
        RecordComparisonContentComponent,
        RecordComparisonContentFieldComponent,
        RecordComparisonDialogComponent,
        RecordComparisonComponent,
        SetRecordsComponent,
        EntriesComponent,
        DetailsComponent,
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
    MatDialogModule,
  ],
    providers: [
        ReferenceDocumentService,
    ]
})
export class RecordComparisonModule {
  public static forRoot(config, fhirProfiles): ModuleWithProviders<RecordComparisonModule>{
    return {
      ngModule: RecordComparisonModule,
      providers: [
        {
          provide: 'comparisonConfig',
          useValue: config
        },
        {
          provide: 'fhirProfiles',
          useValue: fhirProfiles
        },

      ]
    }
  }
}

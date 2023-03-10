import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyRadioModule as MatRadioModule} from "@angular/material/legacy-radio";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatStepperModule} from "@angular/material/stepper";
import {FhirValidatorModule} from "../fhir-validator/fhir-validator.module";
import {ImportCaseComponent} from "./components/import-case.component";
import {ImportCaseFhirRecordComponent} from "./components/import-case-fhir-record/import-case-fhir-record.component";
import {
  ImportCaseConnectathonTemplateComponent
} from "./components/import-case-connectathon-template/import-case-connectathon-template.component";
import {MappingsComponent} from "./components/mappings/mappings.component";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";


@NgModule({
  declarations: [
    ImportCaseComponent,
    ImportCaseComponent,
    ImportCaseFhirRecordComponent,
    ImportCaseConnectathonTemplateComponent,
    MappingsComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule,
    MatStepperModule,
    FormsModule,
    FhirValidatorModule,
    MatButtonModule,
  ]
})
export class ImportCaseModule { }

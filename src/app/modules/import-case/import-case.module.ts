import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRadioModule} from "@angular/material/radio";
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
import {MatButtonModule} from "@angular/material/button";


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
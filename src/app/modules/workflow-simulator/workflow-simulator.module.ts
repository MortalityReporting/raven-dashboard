import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SearchEdrsComponent} from "./components/search-edrs/search-edrs.component";
import {
  MdiToEdrsGridComponent
} from "./components/search-edrs/mdi-to-edrs-document-select-step/mdi-to-edrs-grid/mdi-to-edrs-grid.component";
import {InputTextDialogComponent} from "../../components/widgets/input-text-dialog/input-text-dialog.component";
import {
  ImportMdiToEdrsDocumentComponent
} from "./components/search-edrs/mdi-to-edrs-document-select-step/import-mdi-to-edrs-document/import-mdi-to-edrs-document.component";
import {
  EndpointConfigurationStepComponent
} from "./components/search-edrs/endpoint-configuration-step/endpoint-configuration-step.component";
import {EdrsResultsStepComponent} from "./components/search-edrs/edrs-results-step/edrs-results-step.component";
import {DecedentBasicInfoComponent} from "./components/search-edrs/decedent-basic-info/decedent-basic-info.component";
import {
  SearchParametersComponent
} from "./components/search-edrs/edrs-results-step/search-parameters/search-parameters.component";
import {
  EdrsSearchResultsGridComponent
} from "./components/search-edrs/edrs-results-step/edrs-search-results-grid/edrs-search-results-grid.component";
import {
  EdrsRecordSummaryComponent
} from "./components/search-edrs/edrs-results-step/edrs-record-summary/edrs-record-summary.component";
import {
  HttpRequestInfoComponent
} from "./components/search-edrs/edrs-results-step/http-request-info/http-request-info.component";
import {
  HttpResponseInfoComponent
} from "./components/search-edrs/edrs-results-step/http-response-info/http-response-info.component";
import {WorkflowSimulatorComponent} from "./components/workflow-simulator.component";
import {
  MdiToEdrsDocumentSelectStepComponent
} from "./components/search-edrs/mdi-to-edrs-document-select-step/mdi-to-edrs-document-select-step.component";
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
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatStepperModule} from "@angular/material/stepper";



@NgModule({
  declarations: [
    SearchEdrsComponent,
    MdiToEdrsGridComponent,
    InputTextDialogComponent,
    ImportMdiToEdrsDocumentComponent,
    EndpointConfigurationStepComponent,
    EdrsResultsStepComponent,
    DecedentBasicInfoComponent,
    SearchParametersComponent,
    EdrsSearchResultsGridComponent,
    EdrsRecordSummaryComponent,
    HttpRequestInfoComponent,
    HttpResponseInfoComponent,
    WorkflowSimulatorComponent,
    MdiToEdrsDocumentSelectStepComponent],
  exports: [
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
    MatStepperModule
  ]
})
export class WorkflowSimulatorModule { }

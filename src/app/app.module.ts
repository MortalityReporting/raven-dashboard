import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './components/header/header.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog'
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FhirValidatorModule} from "./modules/fhir-validator/fhir-validator.module";
import {FhirAuthInterceptor} from "./interceptors/fhir-auth.interceptor";
import {MatGridListModule} from '@angular/material/grid-list';
import {
  CaseComparisonContentComponent
} from './components/pages/case-comparison/case-comparison-content/case-comparison-content.component';
import {
  CaseComparisonContentFieldComponent
} from './components/pages/case-comparison/case-comparison-content-field/case-comparison-content-field.component';
import {LandingComponent} from './components/landing/landing.component';
import {FhirExplorerDrawerService} from "./modules/fhir-explorer/services/fhir-explorer-drawer.service";
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from "@angular/material/list";
import {ImportCaseComponent} from './components/pages/import-case/import-case.component';
import {
  ImportCaseFhirRecordComponent
} from './components/pages/import-case/import-case-fhir-record/import-case-fhir-record.component';
import {
  ImportCaseConnectathonTemplateComponent
} from './components/pages/import-case/import-case-connectathon-template/import-case-connectathon-template.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {ConformationDialogComponent} from "./components/widgets/conformation-dialog/conformation-dialog.component";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MappingsComponent} from './components/pages/import-case/mappings/mappings.component';
import {ModalComponent} from './components/widgets/modal/modal.component';
import {
  CaseComparisonDialogComponent
} from './components/pages/case-comparison/case-comparison-dialog/case-comparison-dialog.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatStepperModule} from "@angular/material/stepper";
import {UiStringConstants} from "./providers/ui-string-constants";
import { SearchParametersComponent } from './components/pages/workflow-simulator/search-edrs/edrs-results-step/search-parameters/search-parameters.component';
import { EdrsSearchResultsGridComponent } from './components/pages/workflow-simulator/search-edrs/edrs-results-step/edrs-search-results-grid/edrs-search-results-grid.component';
import { EdrsRecordSummaryComponent } from './components/pages/workflow-simulator/search-edrs/edrs-results-step/edrs-record-summary/edrs-record-summary.component';
import { HttpRequestInfoComponent } from './components/pages/workflow-simulator/search-edrs/edrs-results-step/http-request-info/http-request-info.component';
import { HttpResponseInfoComponent } from './components/pages/workflow-simulator/search-edrs/edrs-results-step/http-response-info/http-response-info.component';
import {
  ImportMdiToEdrsDocumentComponent
} from './components/pages/workflow-simulator/search-edrs/mdi-to-edrs-document-select-step/import-mdi-to-edrs-document/import-mdi-to-edrs-document.component';
import {
  EndpointConfigurationStepComponent
} from './components/pages/workflow-simulator/search-edrs/endpoint-configuration-step/endpoint-configuration-step.component';
import {
  EdrsResultsStepComponent
} from './components/pages/workflow-simulator/search-edrs/edrs-results-step/edrs-results-step.component';
import {
  DecedentBasicInfoComponent
} from './components/pages/workflow-simulator/search-edrs/decedent-basic-info/decedent-basic-info.component';
import {InputTextDialogComponent} from './components/widgets/input-text-dialog/input-text-dialog.component';
import {
  MdiToEdrsGridComponent
} from "./components/pages/workflow-simulator/search-edrs/mdi-to-edrs-document-select-step/mdi-to-edrs-grid/mdi-to-edrs-grid.component";
import {SearchEdrsComponent} from "./components/pages/workflow-simulator/search-edrs/search-edrs.component";
import {WorkflowSimulatorComponent} from './components/pages/workflow-simulator/workflow-simulator.component';
import { MdiToEdrsDocumentSelectStepComponent } from './components/pages/workflow-simulator/search-edrs/mdi-to-edrs-document-select-step/mdi-to-edrs-document-select-step.component';
import { RecordViewerModule } from "./modules/record-viewer/record-viewer.module";
import { FhirUtilModule } from "./modules/fhir-util/fhir-util.module";
import {environment} from "../environments/environment";
import {FhirExplorerModule} from "./modules/fhir-explorer/fhir-explorer.module";
import {CaseComparisonComponent} from "./components/pages/case-comparison/case-comparison.component";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        LandingComponent,
        CaseComparisonContentComponent,
        CaseComparisonContentFieldComponent,
        ImportCaseComponent,
        ImportCaseFhirRecordComponent,
        ImportCaseConnectathonTemplateComponent,
        ConformationDialogComponent,
        MappingsComponent,
        ModalComponent,
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
        MdiToEdrsDocumentSelectStepComponent,
        CaseComparisonComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        HttpClientModule,
        MatRadioModule,
        FormsModule,
        MatCardModule,
        MatSnackBarModule,
        FhirValidatorModule,
        MatGridListModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatTooltipModule,
        MatListModule,
        MatTabsModule,
        MatSelectModule,
        MatMenuModule,
        ClipboardModule,
        MatDialogModule,
        MatStepperModule,
        MatCheckboxModule,
        RecordViewerModule.forRoot(environment),
        FhirUtilModule,
        FhirExplorerModule
    ],

  providers: [
    UiStringConstants,
    {provide: HTTP_INTERCEPTORS, useClass: FhirAuthInterceptor, multi: true},
    FhirExplorerDrawerService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [CaseComparisonDialogComponent],
})
export class AppModule {
}

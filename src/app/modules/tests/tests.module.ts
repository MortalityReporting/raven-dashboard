import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchEdrsComponent} from "./components/search-edrs/search-edrs.component";
import {
  MdiToEdrsGridComponent
} from "./components/search-edrs/mdi-to-edrs-document-select-step/mdi-to-edrs-grid/mdi-to-edrs-grid.component";
import {
  ImportMdiToEdrsDocumentComponent
} from "./components/search-edrs/mdi-to-edrs-document-select-step/import-mdi-to-edrs-document/import-mdi-to-edrs-document.component";
import {
  EndpointConfigurationStepComponent
} from "./components/search-edrs/endpoint-configuration-step/endpoint-configuration-step.component";
import {EdrsResultsStepComponent} from "./components/search-edrs/edrs-results-step/edrs-results-step.component";
import {
  DecedentBasicInfoComponent
} from "./components/search-edrs/decedent-basic-info/decedent-basic-info.component";
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
import {
  MdiToEdrsDocumentSelectStepComponent
} from "./components/search-edrs/mdi-to-edrs-document-select-step/mdi-to-edrs-document-select-step.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatStepperModule} from "@angular/material/stepper";
import {MatSortModule} from "@angular/material/sort";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {ModuleHeaderConfig} from "../../providers/module-header-config";
import {HttpConnectionComponent} from './components/onboarding/http-connection/http-connection.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDividerModule} from "@angular/material/divider";
import {OnboardingComponent} from './components/onboarding/onboarding.component';
import {
  HttpResponseResultsComponent
} from './components/onboarding/http-connection/http-response-results/http-response-results.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import { UpdateEdrsComponent } from './components/update-edrs/update-edrs.component';
import {NgxHisbLoggerModule} from "ngx-hisb-logger";
import { ValidationComponent } from './components/validation/validation.component';
import { EstablishConnectionComponent } from './components/search-edrs-bluejay/establish-connection/establish-connection.component';
import { SearchEdrsBluejayComponent } from './components/search-edrs-bluejay/search-edrs-bluejay.component';
import { DeathCertificateReviewSubmissionComponent } from './components/death-certificate-review-submission/death-certificate-review-submission.component';
import {MatListItem, MatSelectionList} from "@angular/material/list";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from "@angular/material/timepicker";
import { DcrFormSubmissionComponent } from './components/death-certificate-review-submission/dcr-form-submission/dcr-form-submission.component';
import { DcrFhirBundleReviewComponent } from './components/death-certificate-review-submission/dcr-fhir-bundle-review/dcr-fhir-bundle-review.component';
import { ExternalApiDataSubmission } from './components/external-api-data-submission/external-api-data-submission.component';
import { ResponseViewerComponent } from './components/response-viewer/response-viewer.component';
import { ToxicologyRecordSubmissionComponent } from './components/toxicology-record-submission/toxicology-record-submission.component';
import {RecordViewerModule} from "../record-viewer/record-viewer.module";
import {
  ToxRecordDetailsComponent
} from "./components/toxicology-record-submission/tox-record-details/tox-record-details.component";
import {
  SimpleJsonViewerComponent
} from "./components/toxicology-record-submission/simple-json-viewer/simple-json-viewer.component";

@NgModule({
  declarations: [
    SearchEdrsComponent,
    MdiToEdrsGridComponent,
    ImportMdiToEdrsDocumentComponent,
    EndpointConfigurationStepComponent,
    EdrsResultsStepComponent,
    DecedentBasicInfoComponent,
    SearchParametersComponent,
    EdrsSearchResultsGridComponent,
    EdrsRecordSummaryComponent,
    HttpRequestInfoComponent,
    HttpResponseInfoComponent,
    MdiToEdrsDocumentSelectStepComponent,
    HttpConnectionComponent,
    OnboardingComponent,
    HttpResponseResultsComponent,
    UpdateEdrsComponent,
    ValidationComponent,
    EstablishConnectionComponent,
    SearchEdrsBluejayComponent,
    DeathCertificateReviewSubmissionComponent,
    DcrFormSubmissionComponent,
    DcrFhirBundleReviewComponent,
    ExternalApiDataSubmission,
    ResponseViewerComponent,
    ToxicologyRecordSubmissionComponent,
    ToxRecordDetailsComponent
  ],
  exports: [
    EdrsResultsStepComponent,
    OnboardingComponent,
    SearchEdrsComponent,
    UpdateEdrsComponent,
    ValidationComponent
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
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatSortModule,
    MatCheckboxModule,
    MatDividerModule,
    ClipboardModule,
    NgxHisbLoggerModule,
    MatSelectionList,
    MatListItem,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatTimepickerInput,
    MatTimepicker,
    MatTimepickerToggle,
    RecordViewerModule,
    SimpleJsonViewerComponent,
  ],
})
export class TestsModule {
  public static forRoot(environment: any, config: ModuleHeaderConfig, appConfig: any): ModuleWithProviders<any> {
    return {
      ngModule: TestsModule,
      providers: [
        provideNativeDateAdapter(),
        {
          provide: 'env',
          useValue: environment
        },
        {
          provide: 'workflowSimulatorConfig',
          useValue: config
        },
        {
          provide: 'appConfig',
          useValue: appConfig
        }
      ]
    }
  }
}

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirUtilModule } from "../fhir-util/fhir-util.module";
import { SearchRecordsComponent } from "./components/search-records/search-records.component";
import { DecedentRecordsGridComponent } from "./components/search-records/decedent-records-grid/decedent-records-grid.component";
import { ToxicologyGridComponent } from "./components/search-records/toxicology-grid/toxicology-grid.component";
import { ToxicologyReportComponent } from "./components/toxicology-report/toxicology-report.component";
import { ToxicologyReportContentComponent } from "./components/toxicology-report/toxicology-report-content/toxicology-report-content.component";
import { ToxicologyReportGridSectionComponent } from "./components/toxicology-report/toxicology-report-grid-section/toxicology-report-grid-section.component";
import { ToxicologyReportMdiCaseComponent } from "./components/toxicology-report/toxicology-report-mdi-case/toxicology-report-mdi-case.component";
import { CaseSummaryComponent } from "./components/case-summary/case-summary.component";
import { CaseContainerComponent } from "./components/case-container/case-container.component";
import {
  CaseSummaryContentComponent
} from "./components/case-summary/case-summary-content/case-summary-content.component";
import {
  CaseSummaryContentFieldComponent
} from "./components/case-summary/case-summary-content-field/case-summary-content-field.component";
import {
  CaseSummaryRelatedToxComponent
} from "./components/case-summary/case-summary-related-tox/case-summary-related-tox.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {FhirExplorerModule} from "../fhir-explorer/fhir-explorer.module";
import {MatTableModule} from "@angular/material/table";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTabsModule} from "@angular/material/tabs";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {HttpClientModule} from "@angular/common/http";
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FhirValidatorModule} from "../fhir-validator/fhir-validator.module";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSelectModule} from "@angular/material/select";
import {MatMenuModule} from "@angular/material/menu";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MatStepperModule} from "@angular/material/stepper";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  declarations: [
    SearchRecordsComponent,
    DecedentRecordsGridComponent,
    ToxicologyGridComponent,
    CaseContainerComponent,
    ToxicologyReportComponent,
    ToxicologyReportContentComponent,
    ToxicologyReportGridSectionComponent,
    ToxicologyReportMdiCaseComponent,
    CaseSummaryComponent,
    CaseSummaryContentComponent,
    CaseSummaryContentFieldComponent,
    CaseSummaryRelatedToxComponent
  ],
  imports: [
    CommonModule,
    FhirUtilModule, // Dependency
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    FhirExplorerModule,
    MatTableModule,
    MatExpansionModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
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
    MatSelectModule,
    MatMenuModule,
    ClipboardModule,
    MatDialogModule,
    MatStepperModule,
    MatCheckboxModule,



  ]
})
export class RecordViewerModule {
  public static forRoot(environment: any): ModuleWithProviders<any>{
    return {
      ngModule: RecordViewerModule,
      providers: [
        {
          provide: 'env',
          useValue: environment
        }
      ]
    }
  }
}

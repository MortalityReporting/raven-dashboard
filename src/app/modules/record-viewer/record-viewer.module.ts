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
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {RouterModule} from "@angular/router";
import {FhirExplorerModule} from "../fhir-explorer/fhir-explorer.module";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {DomSanitizer} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {MatSortModule} from "@angular/material/sort";
import {ModuleHeaderConfig} from "../../../assets/configuration/module-header-config";
import {CustomSpinnerDirective} from "../common-ui/directives/custom-spinner.directive";
import {CommonUiModule} from "../common-ui/common-ui.module";

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
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSortModule,
    CommonUiModule
  ]
})
export class RecordViewerModule {
  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    const path = "assets"
    this.matIconRegistry.addSvgIcon("labs", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/labs.svg`));
    this.matIconRegistry.addSvgIcon("lab_panel", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/lab_panel.svg`));
    this.matIconRegistry.addSvgIcon("clinical_notes", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/clinical_notes.svg`));
  }

  public static forRoot(environment: any, config: ModuleHeaderConfig): ModuleWithProviders<any>{
    return {
      ngModule: RecordViewerModule,
      providers: [
        {
          provide: 'env',
          useValue: environment
        },
        {
          provide: 'config',
          useValue: config
        }
      ]
    }
  }
}

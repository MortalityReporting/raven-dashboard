import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirUtilModule } from "../fhir-util/fhir-util.module";
import { SearchRecordsComponent } from "./components/search-records/search-records.component";
import { DecedentRecordsGridComponent } from "./components/search-records/decedent-records-grid/decedent-records-grid.component";
import { ToxicologyGridComponent } from "./components/search-records/toxicology-grid/toxicology-grid.component";
import { ToxicologyReportComponent } from "./components/tox-to-mdi/toxicology-report.component";
import { ToxicologyReportContentComponent } from "./components/tox-to-mdi/toxicology-report-content/toxicology-report-content.component";
import { ToxicologyReportGridSectionComponent } from "./components/tox-to-mdi/toxicology-report-grid-section/toxicology-report-grid-section.component";
import { ToxicologyReportMdiCaseComponent } from "./components/tox-to-mdi/toxicology-report-mdi-case/toxicology-report-mdi-case.component";
import { CaseSummaryComponent } from "./components/mdi-to-edrs/case-summary.component";
import { CaseContainerComponent } from "./components/viewer-container/case-container.component";
import {
  CaseSummaryContentComponent
} from "./components/mdi-to-edrs/case-summary-content/case-summary-content.component";
import {
  CaseSummaryContentFieldComponent
} from "./components/mdi-to-edrs/case-summary-content-field/case-summary-content-field.component";
import {
  CaseSummaryRelatedToxComponent
} from "./components/mdi-to-edrs/case-summary-related-tox/case-summary-related-tox.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterModule} from "@angular/router";
import {FhirExplorerModule} from "../fhir-explorer/fhir-explorer.module";
import {MatExpansionModule} from "@angular/material/expansion";
import {DomSanitizer} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {MatSortModule} from "@angular/material/sort";
import {ModuleHeaderConfig} from "../../providers/module-header-config";
import {CommonUiModule} from "../common-ui/common-ui.module";
import {MatTableModule} from "@angular/material/table";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatInputModule} from "@angular/material/input";
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import { DecedentDisplayComponent } from './components/decedent-display/decedent-display.component';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {NoteComponent} from "./components/note/note.component";
import {
  ToxicologyReportCertifierComponent
} from "./components/tox-to-mdi/toxicology-report-certifier/toxicology-report-certifier.component";
import {FhirMdiLibraryModule} from "../fhir-mdi-library/fhir-mdi-library.module";
import { MdiToEdrsViewerComponent } from './components/mdi-to-edrs-viewer/mdi-to-edrs-viewer.component';
import { MdiToEdrsViewerNavMenuComponent } from './components/mdi-to-edrs-viewer/mdi-to-edrs-viewer-nav-menu/mdi-to-edrs-viewer-nav-menu.component';
import { MdiToEdrsViewerBodyComponent } from './components/mdi-to-edrs-viewer/mdi-to-edrs-viewer-body/mdi-to-edrs-viewer-body.component';

@NgModule({
  declarations: [
    SearchRecordsComponent,
    DecedentRecordsGridComponent,
    ToxicologyGridComponent,
    CaseContainerComponent,
    ToxicologyReportComponent,
    ToxicologyReportContentComponent,
    ToxicologyReportCertifierComponent,
    ToxicologyReportGridSectionComponent,
    ToxicologyReportMdiCaseComponent,
    CaseSummaryComponent,
    CaseSummaryContentComponent,
    CaseSummaryContentFieldComponent,
    CaseSummaryRelatedToxComponent,
    DecedentDisplayComponent,
    NoteComponent,
    MdiToEdrsViewerComponent,
    MdiToEdrsViewerNavMenuComponent,
    MdiToEdrsViewerBodyComponent,
  ],
  imports: [
    CommonModule,
    FhirUtilModule, // Dependency
    FhirMdiLibraryModule, // Dependency
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
    CommonUiModule,
    ScrollingModule
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

  public static forRoot(environment: any, config: ModuleHeaderConfig, appConfig: any, fhirProfiles): ModuleWithProviders<any>{
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
        },
        {
          provide: 'appConfig',
          useValue: appConfig
        },
        {
          provide: 'fhirProfiles',
          useValue: fhirProfiles
        }
      ]
    }
  }
}

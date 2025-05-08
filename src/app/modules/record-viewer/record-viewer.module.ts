import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirUtilModule } from "../fhir-util/fhir-util.module";
import { SearchRecordsComponent } from "./components/search-records/search-records.component";
import { DecedentRecordsGridComponent } from "./components/search-records/decedent-records-grid/decedent-records-grid.component";
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
import {FhirMdiLibraryModule} from "../fhir-mdi-library/fhir-mdi-library.module";
import { MdiToEdrsViewerComponent } from './components/mdi-to-edrs-viewer/mdi-to-edrs-viewer.component';
import { MdiToEdrsViewerNavMenuComponent } from './components/mdi-to-edrs-viewer/mdi-to-edrs-viewer-nav-menu/mdi-to-edrs-viewer-nav-menu.component';
import { MdiToEdrsViewerContentComponent } from './components/mdi-to-edrs-viewer/mdi-to-edrs-viewer-content/mdi-to-edrs-viewer-content.component';
import {
  MdiToEdrsViewerContentFieldComponent
} from "./components/mdi-to-edrs-viewer/mdi-to-edrs-viewer-content-field/mdi-to-edrs-viewer-content-field.component";
import {
  MdiToEdrsViewerRelatedToxComponent
} from "./components/mdi-to-edrs-viewer/mdi-to-edrs-viewer-related-tox/mdi-to-edrs-viewer-related-tox.component";
import { ToxToMdiViewerComponent } from './components/tox-to-mdi-viewer/tox-to-mdi-viewer.component';
import { MdiToEdrsViewerPractitionerCardComponent } from './components/mdi-to-edrs-viewer/mdi-to-edrs-viewer-practitioner-card/mdi-to-edrs-viewer-practitioner-card.component';
import { ToxToMdiViewerNavMenuComponent } from './components/tox-to-mdi-viewer/tox-to-mdi-viewer-nav-menu/tox-to-mdi-viewer-nav-menu.component';
import { ToxToMdiViewerContentComponent } from './components/tox-to-mdi-viewer/tox-to-mdi-viewer-content/tox-to-mdi-viewer-content.component';
import {
  ToxToMdiViewerCertifierComponent
} from "./components/tox-to-mdi-viewer/tox-to-mdi-viewer-certifier/tox-to-mdi-viewer-certifier.component";
import {
  ToxToMdiViewerGridSectionComponent
} from "./components/tox-to-mdi-viewer/tox-to-mdi-viewer-grid-section/tox-to-mdi-viewer-grid-section.component";
import {ToxicologyGridComponent} from "./components/search-records/toxicology-grid/toxicology-grid.component";
import {
  ToxToMdiViewerMdiCaseComponent
} from "./components/tox-to-mdi-viewer/tox-to-mdi-viewer-mdi-case/tox-to-mdi-viewer-mdi-case.component";
import {CommonErrorComponent} from "ngx-hisb-common-ui";
import {CustomSpinnerDirective} from "./directives/custom-spinner.directive";
import { ToxDemoCardComponent } from './components/tox-to-mdi-viewer/tox-demo-card/tox-demo-card.component';
import { DcrViewerComponent } from './components/dcr-viewer/dcr-viewer.component';
import { DcrGridComponent } from './components/search-records/dcr-grid/dcr-grid.component';
import { DcrViewerNavMenuComponent } from './components/dcr-viewer/dcr-viewer-nav-menu/dcr-viewer-nav-menu.component';
import { DcrViewerContentComponent } from './components/dcr-viewer/dcr-viewer-content/dcr-viewer-content.component';
import { DcrContentDemographicsComponent } from './components/dcr-viewer/dcr-viewer-content/dcr-content-demographics/dcr-content-demographics.component';
import { DcrContentDeathInvestigationComponent } from './components/dcr-viewer/dcr-viewer-content/dcr-content-death-investigation/dcr-content-death-investigation.component';
import { DcrContentCremationClearanceComponent } from './components/dcr-viewer/dcr-viewer-content/dcr-content-cremation-clearance/dcr-content-cremation-clearance.component';
import { DcrContentCaseAdminInfoComponent } from './components/dcr-viewer/dcr-viewer-content/dcr-content-case-admin-info/dcr-content-case-admin-info.component';
import { DcrViewerSignatureComponent } from './components/dcr-viewer/dcr-viewer-content/dcr-viewer-signature/dcr-viewer-signature.component';

@NgModule({
    declarations: [
        SearchRecordsComponent,
        DecedentRecordsGridComponent,
        ToxicologyGridComponent,
        ToxToMdiViewerMdiCaseComponent,
        MdiToEdrsViewerRelatedToxComponent,
        DecedentDisplayComponent,
        MdiToEdrsViewerComponent,
        MdiToEdrsViewerNavMenuComponent,
        MdiToEdrsViewerContentComponent,
        MdiToEdrsViewerContentFieldComponent,
        ToxToMdiViewerComponent,
        MdiToEdrsViewerPractitionerCardComponent,
        ToxToMdiViewerNavMenuComponent,
        ToxToMdiViewerContentComponent,
        ToxToMdiViewerCertifierComponent,
        ToxToMdiViewerGridSectionComponent,
        CustomSpinnerDirective,
        ToxDemoCardComponent,
        DcrViewerComponent,
        DcrGridComponent,
        DcrViewerNavMenuComponent,
        DcrViewerContentComponent,
        DcrContentDemographicsComponent,
        DcrContentDeathInvestigationComponent,
        DcrContentCremationClearanceComponent,
        DcrContentCaseAdminInfoComponent,
        DcrViewerSignatureComponent,
    ],
  exports: [
    ToxToMdiViewerGridSectionComponent,
    ToxicologyGridComponent
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
        ScrollingModule,
        CommonErrorComponent
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

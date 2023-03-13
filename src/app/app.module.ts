import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FhirValidatorModule} from "./modules/fhir-validator/fhir-validator.module";
import {FhirAuthInterceptor} from "./interceptors/fhir-auth.interceptor";
import {LandingComponent} from './components/landing/landing.component';
import {FhirExplorerDrawerService} from "./modules/fhir-explorer/services/fhir-explorer-drawer.service";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {ModalComponent} from './components/widgets/modal/modal.component';
import {UiStringConstants} from "./providers/ui-string-constants";
import {WorkflowSimulatorModule} from "./modules/workflow-simulator/workflow-simulator.module";
import {ImportCaseModule} from "./modules/import-case/import-case.module";
import {RecordViewerModule} from "./modules/record-viewer/record-viewer.module";
import {FhirUtilModule} from "./modules/fhir-util/fhir-util.module";
import {environment} from "../environments/environment";
import {FhirExplorerModule} from "./modules/fhir-explorer/fhir-explorer.module";
import {RecordComparisonModule} from "./modules/record-comparison/record-comparison.module";
import {BreadcrumbComponent} from './modules/common-ui/components/breadcrumb/breadcrumb.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {ModuleHeaderConfig} from "../assets/configuration/module-header-config";
import {HeaderComponent, NavMenuComponent} from "common-ui";
import {CommonUiModule} from "./modules/common-ui/common-ui.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button"; // TODO: Rename/move components to library.

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ModalComponent,
  ],
  imports: [
    // TODO: Clean up imports after refactor.
    HeaderComponent, // Confirmed
    NavMenuComponent, // Confirmed
    BrowserModule, // Confirmed
    AppRoutingModule, // Confirmed
    BrowserAnimationsModule, // Confirmed
    MatTooltipModule,
    MatDialogModule,
    MatCardModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    FhirValidatorModule,
    ClipboardModule,
    WorkflowSimulatorModule,
    ImportCaseModule,
    RecordViewerModule.forRoot(environment, ModuleHeaderConfig.RecordViewer),
    FhirUtilModule,
    FhirExplorerModule,
    RecordComparisonModule,
    CommonUiModule,
    MatSidenavModule,
    CommonUiModule,
  ],

  providers: [
    UiStringConstants,
    {provide: HTTP_INTERCEPTORS, useClass: FhirAuthInterceptor, multi: true},
    FhirExplorerDrawerService,
  ],
  bootstrap: [AppComponent],

  exports: [
    BreadcrumbComponent
  ]
})
export class AppModule {
}

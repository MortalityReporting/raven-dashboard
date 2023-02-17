import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './components/header/header.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog'
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatCardModule} from "@angular/material/card";
import {FhirValidatorModule} from "./modules/fhir-validator/fhir-validator.module";
import {FhirAuthInterceptor} from "./interceptors/fhir-auth.interceptor";
import {LandingComponent} from './components/landing/landing.component';
import {FhirExplorerDrawerService} from "./modules/fhir-explorer/services/fhir-explorer-drawer.service";
import {MatMenuModule} from '@angular/material/menu';
import {ConformationDialogComponent} from "./components/widgets/conformation-dialog/conformation-dialog.component";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {ModalComponent} from './components/widgets/modal/modal.component';
import {
  RecordComparisonDialogComponent
} from './modules/record-comparison/components/record-comparison-dialog/record-comparison-dialog.component';
import {UiStringConstants} from "./providers/ui-string-constants";

import {WorkflowSimulatorModule} from "./modules/workflow-simulator/workflow-simulator.module";
import {ImportCaseModule} from "./modules/import-case/import-case.module";
import {RecordViewerModule} from "./modules/record-viewer/record-viewer.module";
import {FhirUtilModule} from "./modules/fhir-util/fhir-util.module";
import {environment} from "../environments/environment";
import {FhirExplorerModule} from "./modules/fhir-explorer/fhir-explorer.module";
import {MatListModule} from "@angular/material/list";
import {RecordComparisonModule} from "./modules/record-comparison/record-comparison.module";
import {BreadcrumbComponent} from './components/breadcrumb/breadcrumb.component';

@NgModule({
    declarations: [
      AppComponent,
      HeaderComponent,
      LandingComponent,
      ConformationDialogComponent,
      ModalComponent,
      BreadcrumbComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    RecordViewerModule.forRoot(environment),
    FhirUtilModule,
    FhirExplorerModule,
    RecordComparisonModule,
  ],

  providers: [
    UiStringConstants,
    {provide: HTTP_INTERCEPTORS, useClass: FhirAuthInterceptor, multi: true},
    FhirExplorerDrawerService,
  ],
  bootstrap: [AppComponent],

})
export class AppModule {
}

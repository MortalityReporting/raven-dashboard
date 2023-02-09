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
import {LandingComponent} from './components/landing/landing.component';
import {FhirExplorerDrawerService} from "./modules/fhir-explorer/services/fhir-explorer-drawer.service";
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {ConformationDialogComponent} from "./components/widgets/conformation-dialog/conformation-dialog.component";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {ModalComponent} from './components/widgets/modal/modal.component';
import {
  CaseComparisonDialogComponent
} from './modules/record-comparison/components/case-comparison/case-comparison-dialog/case-comparison-dialog.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatStepperModule} from "@angular/material/stepper";
import {UiStringConstants} from "./providers/ui-string-constants";

import {WorkflowSimulatorModule} from "./modules/workflow-simulator/workflow-simulator.module";
import {ImportCaseModule} from "./modules/import-case/import-case.module";
import {RecordViewerModule} from "./modules/record-viewer/record-viewer.module";
import {FhirUtilModule} from "./modules/fhir-util/fhir-util.module";
import {environment} from "../environments/environment";
import {FhirExplorerModule} from "./modules/fhir-explorer/fhir-explorer.module";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatListModule} from "@angular/material/list";
import {RecordComparisonModule} from "./modules/record-comparison/record-comparison.module";

@NgModule({
    declarations: [
      AppComponent,
      HeaderComponent,
      LandingComponent,
      ConformationDialogComponent,
      ModalComponent,
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
        WorkflowSimulatorModule,
        ImportCaseModule,
        RecordViewerModule.forRoot(environment),
        FhirUtilModule,
        FhirExplorerModule,
        RecordComparisonModule
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

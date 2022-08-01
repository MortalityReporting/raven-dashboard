import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {DecedentRecordsGridComponent} from './components/pages/decedent-records-grid/decedent-records-grid.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FhirValidatorModule} from "./fhir-validator/fhir-validator.module";
import {FhirAuthInterceptor} from "./interceptors/fhir-auth.interceptor";
import {MatGridListModule} from '@angular/material/grid-list';
import { CaseSummaryComponent } from './components/pages/case-summary/case-summary.component';
import { LandingComponent } from './components/landing/landing.component';
import { CaseContainerComponent } from './components/pages/case-container/case-container.component';
import {FhirExplorerDrawerService} from "./service/fhir-explorer-drawer.service";
import {MatExpansionModule} from '@angular/material/expansion';
import { FhirExplorerComponent } from './components/fhir-explorer/fhir-explorer.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { CaseSummaryContentComponent } from './components/pages/case-summary/case-summary-content/case-summary-content.component';
import { SetFhirExplorerDirective } from './directives/set-fhir-explorer.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CaseSummaryContentFieldComponent } from './components/pages/case-summary/case-summary-content-field/case-summary-content-field.component';
import {MatListModule} from "@angular/material/list";
import { ImportCaseComponent } from './components/pages/import-case/import-case.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DecedentRecordsGridComponent,
    CaseSummaryComponent,
    LandingComponent,
    CaseContainerComponent,
    FhirExplorerComponent,
    CaseSummaryContentComponent,
    SetFhirExplorerDirective,
    CaseSummaryContentFieldComponent,
    ImportCaseComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
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
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: FhirAuthInterceptor, multi: true },
    FhirExplorerDrawerService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }

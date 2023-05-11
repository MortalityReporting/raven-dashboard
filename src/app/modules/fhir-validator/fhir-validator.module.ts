import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../../app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSortModule} from "@angular/material/sort";
import {HttpClientModule} from "@angular/common/http";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatDividerModule} from "@angular/material/divider";
import { FhirValidatorComponent } from './components/fhir-validator/fhir-validator.component'
import {MatCardModule} from "@angular/material/card";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatRadioModule} from "@angular/material/radio";
import {NgxFhirValidatorModule} from "ngx-fhir-validator";
import {environment} from "../../../environments/environment";
import {ModuleHeaderConfig} from "../../providers/module-header-config";

@NgModule({
    declarations: [
        FhirValidatorComponent,
    ],
  imports: [
    CommonModule,
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
    MatSelectModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    NgxFhirValidatorModule.forRoot(environment.fhirValidator),
  ],
  exports: [
  ],
})
export class FhirValidatorModule {
  public static forRoot(environment: any, config: ModuleHeaderConfig, appConfig: any): ModuleWithProviders<any> {
    return {
      ngModule: FhirValidatorModule,
      providers: [
        {
          provide: 'env',
          useValue: environment
        },
        {
          provide: 'fhirValidatorConfig',
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

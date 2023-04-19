import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatStepperModule} from "@angular/material/stepper";
import {FhirValidatorModule} from "../fhir-validator/fhir-validator.module";
import {ImportCaseComponent} from "./components/import-case.component";
import {ImportCaseFhirRecordComponent} from "./components/import-case-fhir-record/import-case-fhir-record.component";
import {
  ImportCaseConnectathonTemplateComponent
} from "./components/import-case-connectathon-template/import-case-connectathon-template.component";
import {MappingsComponent} from "./components/mappings/mappings.component";
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import { FileTemplateComponent } from './components/file-template/file-template.component';
import {ModuleHeaderConfig} from "../../../assets/configuration/module-header-config";
import {NgxFhirValidatorModule} from "ngx-fhir-validator";


@NgModule({
  declarations: [
    ImportCaseComponent,
    ImportCaseComponent,
    ImportCaseFhirRecordComponent,
    ImportCaseConnectathonTemplateComponent,
    MappingsComponent,
    FileTemplateComponent
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
    FormsModule,
    FhirValidatorModule,
    MatButtonModule,
    NgxFhirValidatorModule,
  ]
})

export class ImportCaseModule {
  public static forRoot(environment: any, config: ModuleHeaderConfig, appConfig: any): ModuleWithProviders<any>{
    return {
      ngModule: ImportCaseModule,
      providers: [
        {
          provide: 'env',
          useValue: environment
        },
        {
          provide: 'importConfig',
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetFhirExplorerDirective } from "./directives/set-fhir-explorer.directive";
import { FhirExplorerComponent } from "./components/fhir-explorer/fhir-explorer.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { ClipboardModule } from "@angular/cdk/clipboard";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";



@NgModule({
  declarations: [
    SetFhirExplorerDirective,
    FhirExplorerComponent
  ],
  exports: [
    SetFhirExplorerDirective,
    FhirExplorerComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatButtonModule,
    ClipboardModule,
    FormsModule,
    MatTooltipModule,

  ]
})
export class FhirExplorerModule { }

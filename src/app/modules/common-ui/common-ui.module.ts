import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModuleHeaderComponent} from "./components/module-header/module-header.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {BreadcrumbComponent} from "./components/breadcrumb/breadcrumb.component";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {CustomSpinnerDirective} from "./directives/custom-spinner.directive";
import {ModuleThemedButtonDirective} from "./directives/moduleThemedButton.directive";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";



@NgModule({
  declarations: [
    ModuleHeaderComponent,
    BreadcrumbComponent,
    CustomSpinnerDirective,
    ModuleThemedButtonDirective
  ],
  exports: [
    ModuleHeaderComponent,
    BreadcrumbComponent,
    CustomSpinnerDirective,
    ModuleThemedButtonDirective
  ],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule,
        RouterLink
    ]
})
export class CommonUiModule {
  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    const path = "assets"
    this.matIconRegistry.addSvgIcon("record-viewer", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/record-viewer.svg`));
    this.matIconRegistry.addSvgIcon("record-import", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/record-import.svg`));
    this.matIconRegistry.addSvgIcon("record-comparison", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/record-comparison.svg`));
    this.matIconRegistry.addSvgIcon("fhir-validator", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/fhir-validator.svg`));
    this.matIconRegistry.addSvgIcon("workflow-simulator", this.domSanitizer
      .bypassSecurityTrustResourceUrl(`${path}/workflow-simulator.svg`));
  }

}

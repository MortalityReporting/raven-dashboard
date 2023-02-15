import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModuleHeaderComponent} from "./components/module-header/module-header.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {BreadcrumbComponent} from "./components/breadcrumb/breadcrumb.component";



@NgModule({
  declarations: [
    ModuleHeaderComponent,
    BreadcrumbComponent
  ],
  exports: [
    ModuleHeaderComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule
  ]
})
export class CommonUiModule { }

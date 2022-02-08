import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FhirValidatorComponent} from "./components/pages/fhir-validator/fhir-validator.component";
import {CaseExplorerComponent} from "./components/pages/case-explorer/case-explorer.component";

const routes: Routes = [
  {
    path: '',
    component: CaseExplorerComponent
  },
  {
    path: 'fhir-validator',
    component: FhirValidatorComponent
  },
  { // Do not add any paths below this point, this path MUST ALWAYS be the last path!
    path: '**', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

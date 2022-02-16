import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FhirValidatorComponent} from "./components/pages/fhir-validator/fhir-validator.component";
import {DecedentRecordsGridComponent} from "./components/pages/decedent-records-grid/decedent-records-grid.component";

const routes: Routes = [
  {
    path: '',
    component: DecedentRecordsGridComponent
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

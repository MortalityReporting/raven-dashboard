import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DecedentRecordsGridComponent} from "./components/pages/decedent-records-grid/decedent-records-grid.component";
import {FhirValidatorComponent} from "./fhir-validator/components/fhir-validator/fhir-validator.component";
import {CaseSummaryComponent} from "./components/pages/case-summary/case-summary.component";

const routes: Routes = [
  {
    path: '',
    component: DecedentRecordsGridComponent
  },
  {
    path: 'fhir-validator',
    component: FhirValidatorComponent
  },
  {
    path: 'summary/:id',
    component: CaseSummaryComponent
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

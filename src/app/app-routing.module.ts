import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DecedentRecordsGridComponent} from "./components/pages/decedent-records-grid/decedent-records-grid.component";
import {FhirValidatorComponent} from "./fhir-validator/components/fhir-validator/fhir-validator.component";
import {LandingComponent} from "./components/landing/landing.component";
import {CaseContainerComponent} from "./components/pages/case-container/case-container.component";

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'cases',
    component: DecedentRecordsGridComponent
  },
  {
    path: 'fhir-validator',
    component: FhirValidatorComponent
  },
  {
    path: 'cases/summary/:id',
    component: CaseContainerComponent
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

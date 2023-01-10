import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from "./components/landing/landing.component";
import {CaseContainerComponent} from "./components/pages/case-container/case-container.component";
import {CaseComparisonComponent} from "./components/pages/case-comparison/case-comparison.component";
import {ImportCaseComponent} from "./components/pages/import-case/import-case.component";
import {FhirValidatorComponent} from "./fhir-validator/components/fhir-validator/fhir-validator.component";
import {CasesComponent} from "./components/pages/cases/cases.component";
import {WorkflowSimulatorComponent} from "./components/pages/workflow-simulator/workflow-simulator.component";
import {SearchEdrsComponent} from "./components/pages/workflow-simulator/search-edrs/search-edrs.component";
import {ToxicologyContainerComponent} from "./components/pages/toxicology-container/toxicology-container.component";

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'records',
    component: CasesComponent
  },
  {
    path: 'comparison/:id',
    component: CaseComparisonComponent
  },
  {
    path: 'comparison',
    component: CaseComparisonComponent
  },
  {
    path: 'fhir-validator',
    component: FhirValidatorComponent
  },
  {
    path: 'records/mdi/:id',
    component: CaseContainerComponent
  },
  {
    path: 'records/tox/:id',
    component: CaseContainerComponent
  },
  {
    path: 'import-case',
    component: ImportCaseComponent
  },
  {
    path: 'workflow-simulator',
    children:[
      {
        path : '',
        component: WorkflowSimulatorComponent,
      },
      {
        path : 'search-edrs',
        component: SearchEdrsComponent,
      }
    ]
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

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from "./components/landing/landing.component";
import {CaseContainerComponent} from "./modules/record-viewer/components/case-container/case-container.component";
import {
  RecordComparisonContainerComponent
} from "./modules/record-comparison/components/record-comparison-container/record-comparison-container.component";
import {ImportCaseComponent} from "./modules/import-case/components/import-case.component";
import {FhirValidatorComponent} from "./modules/fhir-validator/components/fhir-validator/fhir-validator.component";
import {SearchRecordsComponent} from "./modules/record-viewer/components/search-records/search-records.component";
import {WorkflowSimulatorComponent} from "./modules/workflow-simulator/components/workflow-simulator.component";
import {SearchEdrsComponent} from "./modules/workflow-simulator/components/search-edrs/search-edrs.component";
import {ModuleHeaderConfig} from "../assets/configuration/module-header-config";

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  { // Record Viewer Module
    path: 'records',
    children: [
      {
        path: '',
        component: SearchRecordsComponent,
        data: { moduleConfig: ModuleHeaderConfig.RecordViewer, componentTitle: "Search Records"}
      },
      {
        path: 'mdi/:id',
        component: CaseContainerComponent,
        data: { moduleConfig: ModuleHeaderConfig.RecordViewer, componentTitle: "MDI to EDRS Document Viewer"}
      },
      {
        path: 'tox/:id',
        component: CaseContainerComponent,
        data: { moduleConfig: ModuleHeaderConfig.RecordViewer, componentTitle: "Toxicology Report Viewer"}
      }
    ],
  },
  { // Record Comparison Module
    path: 'comparison',
    children: [
      {
        path: ':id',
        component: RecordComparisonContainerComponent,
        data: { moduleConfig: ModuleHeaderConfig.RecordComparison, componentTitle: "MDI to EDRS Record Comparison"}

      },
      {
        path: '',
        component: RecordComparisonContainerComponent,
        data: { moduleConfig: ModuleHeaderConfig.RecordComparison, componentTitle: "MDI to EDRS Record Comparison"}
      },
    ]
  },

  { // FHIR Validator Module
    path: 'fhir-validator',
    component: FhirValidatorComponent,
    data: { moduleConfig: ModuleHeaderConfig.FhirValidator, componentTitle: undefined}

  },
  { // Import Case Module
    path: 'import-case',
    component: ImportCaseComponent,
    data: { moduleConfig: ModuleHeaderConfig.ImportRecord, componentTitle: undefined}
  },
  { // Workflow Simulator Module
    path: 'workflow-simulator',
    children: [
      {
        path: '',
        component: WorkflowSimulatorComponent,
        data: { moduleConfig: ModuleHeaderConfig.WorkflowSimulator, componentTitle: undefined}
      },
      {
        path: 'search-edrs',
        component: SearchEdrsComponent,
        data: { moduleConfig: ModuleHeaderConfig.WorkflowSimulator, componentTitle: "Search EDRS"}
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
export class AppRoutingModule {
}

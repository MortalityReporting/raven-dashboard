import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from "./components/landing/landing.component";
import {ImportCaseComponent} from "./modules/import-case/components/import-case.component";
import {FhirValidatorComponent} from "./modules/fhir-validator/components/fhir-validator/fhir-validator.component";
import {SearchRecordsComponent} from "./modules/record-viewer/components/search-records/search-records.component";
import {WorkflowSimulatorComponent} from "./modules/workflow-simulator/components/workflow-simulator.component";
import {SearchEdrsComponent} from "./modules/workflow-simulator/components/search-edrs/search-edrs.component";
import {ModuleHeaderConfig} from "./providers/module-header-config";
import {AppConfiguration} from "./providers/app-configuration";
import {
  RecordComparisonContentComponent
} from "./modules/record-comparison/components/record-comparison-content/record-comparison-content.component";
import {AdminPanelComponent} from "./modules/user-management/components/admin-panel/admin-panel.component";
import {AuthGuard} from "@auth0/auth0-angular";
import {LoggedInComponent} from "./modules/user-management/components/logged-in/logged-in.component";
import {TestContainerComponent} from "./modules/workflow-simulator/components/test-container/test-container.component";
import {
  MdiToEdrsViewerComponent
} from "./modules/record-viewer/components/mdi-to-edrs-viewer/mdi-to-edrs-viewer.component";
import {
  ToxToMdiViewerComponent
} from "./modules/record-viewer/components/tox-to-mdi-viewer/tox-to-mdi-viewer.component";


const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: {moduleConfig: undefined, componentTitle: undefined}
  },
  { // Record Viewer Module
    path: AppConfiguration.config.modules['recordViewer'].route,
    children: [
      {
        pathMatch: 'full',
        path: '',
        component: SearchRecordsComponent,
        data: { moduleConfig: ModuleHeaderConfig.RecordViewer, componentTitle: "Search Records"}
      },
      {
        path: 'mdi/:id',
        component: MdiToEdrsViewerComponent,
        data: { moduleConfig: ModuleHeaderConfig.RecordViewer, componentTitle: AppConfiguration.config.workflowTitles['mdiToEdrs'] + " Viewer"}
      },
      {
        path: 'tox/:id',
        component: ToxToMdiViewerComponent,
        data: { moduleConfig: ModuleHeaderConfig.RecordViewer, componentTitle: AppConfiguration.config.workflowTitles['toxToMdi'] + " Viewer"}
      }
    ],
  },
  { // Record Comparison Module
    path: AppConfiguration.config.modules['recordComparison'].route,
    children: [
      {
        path: ':id',
        component: RecordComparisonContentComponent,
        data: { moduleConfig: ModuleHeaderConfig.RecordComparison, componentTitle: AppConfiguration.config.workflowTitles['mdiToEdrs'] + " Comparison"}

      },
      {
        path: '',
        component: RecordComparisonContentComponent,
        data: { moduleConfig: ModuleHeaderConfig.RecordComparison, componentTitle: AppConfiguration.config.workflowTitles['mdiToEdrs'] + " Comparison"}
      },
    ]
  },

  { // FHIR Validator Module
    path: AppConfiguration.config.modules['fhirValidator'].route,
    component: FhirValidatorComponent,
    data: { moduleConfig: ModuleHeaderConfig.FhirValidator, componentTitle: undefined}

  },
  { // Import Case Module
    path: AppConfiguration.config.modules['recordImport'].route,
    component: ImportCaseComponent,
    data: { moduleConfig: ModuleHeaderConfig.RecordImport, componentTitle: undefined}
  },
  { // Workflow Simulator Module
    path: AppConfiguration.config.modules['workflowSimulator'].route,
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
      },
      {
        path: 'test',
        component: TestContainerComponent,
        data: { moduleConfig: ModuleHeaderConfig.WorkflowSimulator, componentTitle: "Test"}
      },
    ]
  },
  {
    path: AppConfiguration.config.modules['adminPanel'].route,
    component: AdminPanelComponent,
    data: { moduleConfig: ModuleHeaderConfig.AdminPanel, componentTitle: undefined},
    canActivate: [AuthGuard]
  },
  {
    path: 'logged-in',
    component: LoggedInComponent,
    data: { moduleConfig: undefined, componentTitle: undefined},
    canActivate: [AuthGuard]
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

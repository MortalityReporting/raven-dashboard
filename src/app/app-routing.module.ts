import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from "./components/landing/landing.component";
import {ImportCaseComponent} from "./modules/import-case/components/import-case.component";
import {FhirValidatorComponent} from "./modules/fhir-validator/components/fhir-validator/fhir-validator.component";
import {SearchRecordsComponent} from "./modules/record-viewer/components/search-records/search-records.component";
import {ModuleHeaderConfig} from "./providers/module-header-config";
import {AppConfiguration} from "./providers/app-configuration";
import {AdminPanelComponent} from "./modules/user-management/components/admin-panel/admin-panel.component";
import {AuthGuard} from "@auth0/auth0-angular";
import {LoggedInComponent} from "./modules/user-management/components/logged-in/logged-in.component";
import {
  MdiToEdrsViewerComponent
} from "./modules/record-viewer/components/mdi-to-edrs-viewer/mdi-to-edrs-viewer.component";
import {OnboardingComponent} from "./modules/tests/components/onboarding/onboarding.component";
import {
  ToxToMdiViewerComponent
} from "./modules/record-viewer/components/tox-to-mdi-viewer/tox-to-mdi-viewer.component";
import {SearchEdrsComponent} from "./modules/tests/components/search-edrs/search-edrs.component";
import {
  TestingEventRootComponent
} from "./modules/testing-events/components/testing-event-root/testing-event-root.component";
import {
  StandaloneTestsComponent
} from "./modules/workflow-simulator/components/standalone-tests/standalone-tests.component";
import {
  RecordComparisonComponent
} from "./modules/record-comparison/components/record-comparison.component";


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
        component: RecordComparisonComponent,
        data: { moduleConfig: ModuleHeaderConfig.RecordComparison, componentTitle: AppConfiguration.config.workflowTitles['mdiToEdrs'] + " Comparison"}

      },
      {
        path: '',
        component: RecordComparisonComponent,
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
        component: TestingEventRootComponent,
        data: { moduleConfig: ModuleHeaderConfig.WorkflowSimulator, componentTitle: undefined}
      },
      {
        path: 'standalone-tests',
        component: StandaloneTestsComponent,
        data: { moduleConfig: ModuleHeaderConfig.WorkflowSimulator, componentTitle: "Standalone Tests"}
      },
      {
        path: 'search-edrs',
        component: SearchEdrsComponent,
        data: { moduleConfig: ModuleHeaderConfig.WorkflowSimulator, componentTitle: "Search EDRS"}
      },
      {
        path: 'onboarding',
        component: OnboardingComponent,
        data: { moduleConfig: ModuleHeaderConfig.WorkflowSimulator, componentTitle: "Onboarding"}
      }
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

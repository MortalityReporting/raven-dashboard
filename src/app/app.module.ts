import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FhirValidatorModule} from "./modules/fhir-validator/fhir-validator.module";
import {FhirAuthInterceptor} from "./interceptors/fhir-auth.interceptor";
import {LandingComponent} from './components/landing/landing.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import {ModalComponent} from './components/widgets/modal/modal.component';
import {ImportCaseModule} from "./modules/import-case/import-case.module";
import {RecordViewerModule} from "./modules/record-viewer/record-viewer.module";
import {FhirUtilModule} from "./modules/fhir-util/fhir-util.module";
import {environment} from "../environments/environment";
import {FhirExplorerModule} from "./modules/fhir-explorer/fhir-explorer.module";
import {RecordComparisonModule} from "./modules/record-comparison/record-comparison.module";
import {BreadcrumbComponent} from './components/breadcrumb/breadcrumb.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {ModuleHeaderConfig} from "./providers/module-header-config";
import {CommonUiModule} from "./modules/common-ui/common-ui.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {HeaderComponent, NavMenuComponent} from "ngx-hisb-common-ui";
import {AppConfiguration} from "./providers/app-configuration";
import { CardHoverDirective } from './directives/card-hover.directive';
import { UiStringConstants } from "./providers/ui-string-constants";
import { FHIRProfileConstants } from "./providers/fhir-profile-constants";
import {UserManagementModule} from "./modules/user-management/user-management.module";
import { DocRefBase64TransformPipe } from './modules/fhir-util';
import {ConfigService} from "./service/config.service";
import {RegisteredEndpointsInterceptor} from "./interceptors/registered-endpoints.interceptor";
import {AuthHttpInterceptor} from "@auth0/auth0-angular";
import {WorkflowSimulatorModule} from "./modules/workflow-simulator/workflow-simulator.module";
import {TestsModule} from "./modules/tests/tests.module";
import {AppConstants} from "./providers/app-constants";
import {ModuleHeaderComponent} from "./components/module-header/module-header.component";

export const configFactory = (configService: ConfigService) => {
  return () => configService.loadConfig();
};

// TODO: Setup configGetter here to be able to load the config data into the forRoot methods
// export function configGetter(configService: ConfigService) {
//   return new TranslateHttpLoader(httpClient);
// }

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ModalComponent,
    CardHoverDirective,
    ModuleHeaderComponent,
    BreadcrumbComponent
  ],
  imports: [
    // TODO: Clean up imports after refactor.
    HeaderComponent, // Confirmed
    NavMenuComponent, // Confirmed
    BrowserModule, // Confirmed
    AppRoutingModule, // Confirmed
    BrowserAnimationsModule, // Confirmed
    MatTooltipModule,
    MatDialogModule,
    MatCardModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    FhirValidatorModule.forRoot(environment, ModuleHeaderConfig.FhirValidator, AppConfiguration.config),
    ClipboardModule,
    ImportCaseModule.forRoot(environment, ModuleHeaderConfig.RecordImport, AppConfiguration.config),
    RecordViewerModule.forRoot(environment, ModuleHeaderConfig.RecordViewer, AppConfiguration.config, FHIRProfileConstants.Profiles),
    FhirUtilModule,
    FhirExplorerModule,
    RecordComparisonModule.forRoot(ModuleHeaderConfig.RecordComparison, FHIRProfileConstants.Profiles),
    WorkflowSimulatorModule.forRoot(environment, ModuleHeaderConfig.WorkflowSimulator, AppConfiguration.config),
    TestsModule.forRoot(environment, ModuleHeaderConfig.WorkflowSimulator, AppConfiguration.config),
    CommonUiModule,
    MatSidenavModule,
    CommonUiModule,
    UserManagementModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: UiStringConstants,
    },
    {
      provide: AppConstants,
    },
    {
      provide: 'fhirProfiles',
      useValue: FHIRProfileConstants.Profiles
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RegisteredEndpointsInterceptor,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FhirAuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    BreadcrumbComponent,
    DocRefBase64TransformPipe
  ]
})
export class AppModule {
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

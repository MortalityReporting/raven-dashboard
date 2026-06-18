import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { ConfigService } from './app/config/config.service';
import { configFactory } from './app/config/app-initializer';
import { initializeSvgIcons } from './app/config/svg-icon-initializer';
import { provideUserManagement } from './app/features/user-management';
import { provideImportCase } from './app/features/import-case';
import { provideFhirValidator } from './app/features/fhir-validator-wrapper/fhir-validator.providers';
import { ModuleHeaderConfig } from './app/providers/module-header-config';
import { AppConfiguration } from './app/providers/app-configuration';
import { UiStringConstants } from './app/providers/ui-string-constants';
import { AppConstants } from './app/providers/app-constants';
import { FHIRProfileConstants } from './app/providers/fhir-profile-constants';
import { RegisteredEndpointsInterceptor } from './app/interceptors/registered-endpoints.interceptor';
import { FhirAuthInterceptor } from './app/interceptors/fhir-auth.interceptor';
import { ConditionalAuthInterceptor } from './app/interceptors/conditional-auth.interceptor';
import { provideTests } from './app/features/tests/tests.providers';
import { provideWorkflowSimulator } from './app/features/workflow-simulator/workflow-simulator.providers';
import { provideFhirUtil } from './app/features/fhir-util/fhir-util.providers';
import { provideRecordComparison } from './app/features/record-comparison/record-comparison.providers';
import { provideRecordViewer } from './app/features/record-viewer/record-viewer.providers';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    importProvidersFrom(
      BrowserAnimationsModule
    ),
    provideFhirUtil(),
    provideRecordViewer(ModuleHeaderConfig.RecordViewer, AppConfiguration.config, FHIRProfileConstants.Profiles),
    provideRecordComparison(ModuleHeaderConfig.RecordComparison, FHIRProfileConstants.Profiles),
    provideTests(ModuleHeaderConfig.WorkflowSimulator, AppConfiguration.config),
    provideWorkflowSimulator(ModuleHeaderConfig.WorkflowSimulator, AppConfiguration.config),
    // Provide ConfigService first
    ConfigService,
    // Load config FIRST before any other initializers
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      const initFn = configFactory(configService);
      return initFn(); // Execute the initialization function
    }),
    // Register SVG icons
    provideAppInitializer(() => {
      initializeSvgIcons();
    }),
    // Conditionally provide Auth0 based on enableDashboardApiServices
    provideUserManagement(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ConditionalAuthInterceptor,
      deps: [ConfigService, AuthHttpInterceptor],
      multi: true
    },
    provideImportCase(ModuleHeaderConfig.RecordImport, AppConfiguration.config),
    provideFhirValidator(ModuleHeaderConfig.FhirValidator, AppConfiguration.config),
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
    }
  ]
})
  .catch(err => console.error(err));

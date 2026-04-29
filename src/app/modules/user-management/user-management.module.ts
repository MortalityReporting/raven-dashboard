import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminPanelComponent} from './components/admin-panel/admin-panel.component';
import {AuthModule, AuthClientConfig} from "@auth0/auth0-angular";
import {FhirUtilModule} from "../fhir-util/fhir-util.module";
import {LoggedInComponent} from './components/logged-in/logged-in.component';
import {UserHeaderComponent} from './components/user-header/user-header.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import {EventTableComponent} from './components/event-table/event-table.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {ErrorFrameComponent} from "./components/error-frame/error-frame.component";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ConfigService} from "../../config/config.service";

// Factory function to configure Auth0 after config is loaded
export function configureAuth0(authConfig: AuthClientConfig, configService: ConfigService) {
  return () => {
    return new Promise<void>((resolve) => {
      // Wait for config to be loaded
      configService.loadConfig().subscribe({
        next: (success) => {
          if (success && configService.config) {
            const config = configService.config;
            authConfig.set({
              domain: config.auth.domain,
              clientId: config.auth.clientId,
              authorizationParams: {
                redirect_uri: config.auth.redirectUrl,
                audience: config.auth.auth0.audience,
                scope: "admin profile email openid"
              },
              httpInterceptor: {
                allowedList: [
                  {
                    uri: `${config.dashboardApiUrl}admin-panel`,
                  },
                  {
                    uri: `${config.dashboardApiUrl}attachment/upload`
                  },
                  {
                    uri: `${config.dashboardApiUrl}attachment/download`
                  }
                ]
              }
            });
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  };
}

@NgModule({
  declarations: [
    AdminPanelComponent,
    LoggedInComponent,
    UserHeaderComponent,
    EventTableComponent,
    ErrorFrameComponent
  ],
  exports: [
    UserHeaderComponent
  ],
  imports: [
    AuthModule.forRoot({
      domain: 'placeholder.auth0.com',
      clientId: 'placeholder-client-id',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'placeholder-audience',
        scope: "admin profile email openid"
      },
      httpInterceptor: {
        allowedList: []
      }
    }),
    CommonModule,
    FhirUtilModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth0,
      deps: [AuthClientConfig, ConfigService],
      multi: true
    }
  ]
})
export class UserManagementModule {

}

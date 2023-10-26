import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import {AuthModule} from "@auth0/auth0-angular";
import {FhirUtilModule} from "../fhir-util/fhir-util.module";
import {environment} from "../../../environments/environment";
import { LoggedInComponent } from './components/logged-in/logged-in.component';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatDividerModule} from "@angular/material/divider";
import { EventTableComponent } from './components/event-table/event-table.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {CommonUiModule} from "../common-ui/common-ui.module";
import {ErrorFrameComponent} from "./components/error-frame/error-frame.component";

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
    // Auth0 Testing
    AuthModule.forRoot({
      domain: environment.domain,
      clientId: environment.clientId,
      authorizationParams: {
        redirect_uri: environment.adminRedirectUrl,
        audience: environment.audience,
        scope: "admin profile email openid"
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: `${environment.dashboardApi}admin-panel`,
            // TODO: Setup Scope here.
            // tokenOptions: {
            //   audience: '',
            //   scope: ""
            //
            // }
          },
          {
            uri: `${environment.dashboardApi}document`
          }
        ]
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
    CommonUiModule
  ]
})
export class UserManagementModule {

}

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

@NgModule({
  declarations: [
    AdminPanelComponent,
    LoggedInComponent,
    UserHeaderComponent,
    EventTableComponent
  ],
  exports: [
    UserHeaderComponent
  ],
  imports: [
    // Auth0 Testing
    AuthModule.forRoot({
      domain: 'dev-dk7cyfpkwowbtdbt.us.auth0.com',
      clientId: 'M7knIi1ioWMc6Lufbt5lbyTrnxpKmL4q',
      authorizationParams: {
        redirect_uri: environment.adminRedirectUrl,
        audience: "https://raven.dev.heat.icl.gtri.org/raven-dashboard-api/",
        scope: "admin profile email openid"
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: "http://127.0.0.1:8000/admin-panel",
            // tokenOptions: {
            //   audience: '',
            //   scope: ""
            //
            // }
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
export class UserManagementModule { }

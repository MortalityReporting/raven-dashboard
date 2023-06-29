import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import {AuthModule} from "@auth0/auth0-angular";
import {AppModule} from "../../app.module";
import {FhirUtilModule} from "../fhir-util/fhir-util.module";


@NgModule({
  declarations: [
    AdminPanelComponent
  ],
  imports: [
    // Auth0 Testing
    AuthModule.forRoot({
      domain: 'dev-dk7cyfpkwowbtdbt.us.auth0.com',
      clientId: 'M7knIi1ioWMc6Lufbt5lbyTrnxpKmL4q',
      authorizationParams: {
        redirect_uri: 'https://localhost:4200/workflow-simulator/admin'
      }
    }),
    CommonModule,
    FhirUtilModule,
  ]
})
export class UserManagementModule { }

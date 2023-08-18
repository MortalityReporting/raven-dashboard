import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TestContainerComponent} from "./components/test-container/test-container.component";
import {TestingEventRootComponent} from "./components/testing-event-root/testing-event-root.component";
import {EventRegistrationCardComponent} from "./components/event-registration-card/event-registration-card.component";
import {RegisteredModulesComponent} from "./components/registered-modules/registered-modules.component";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import { DocumentWindowComponent } from './components/document-window/document-window.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {SanitizedUrlPipe} from "./pipes/sanitized-url.pipe";



@NgModule({
  declarations: [
    TestContainerComponent,
    TestingEventRootComponent,
    EventRegistrationCardComponent,
    RegisteredModulesComponent,
    DocumentWindowComponent,
    SanitizedUrlPipe
  ],
  exports: [
    TestingEventRootComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class TestingEventsModule { }

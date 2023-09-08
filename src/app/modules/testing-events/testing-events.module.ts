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
import {TestsModule} from "../tests/tests.module";
import {MatTooltipModule} from "@angular/material/tooltip";



@NgModule({
  declarations: [
    TestContainerComponent,
    TestingEventRootComponent,
    EventRegistrationCardComponent,
    RegisteredModulesComponent,
    DocumentWindowComponent
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
    TestsModule,
    MatTooltipModule,
  ]
})
export class TestingEventsModule { }

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



@NgModule({
  declarations: [
    TestContainerComponent,
    TestingEventRootComponent,
    EventRegistrationCardComponent,
    RegisteredModulesComponent
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
    MatButtonModule
  ]
})
export class TestingEventsModule { }

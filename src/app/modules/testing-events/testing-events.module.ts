import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TestContainerComponent} from "./components/test-container/test-container.component";
import {TestingEventRootComponent} from "./components/testing-event-root/testing-event-root.component";
import {EventRegistrationCardComponent} from "./components/event-registration-card/event-registration-card.component";
import {RegisteredModuleComponent} from "./components/registered-module/registered-module.component";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import { DocumentWindowComponent } from './components/document-window/document-window.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {SanitizedUrlPipe} from "./pipes/sanitized-url.pipe";
import {TestsModule} from "../tests/tests.module";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";



@NgModule({
  declarations: [
    TestContainerComponent,
    TestingEventRootComponent,
    EventRegistrationCardComponent,
    RegisteredModuleComponent,
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
        MatInputModule,
        TestsModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
    ]
})
export class TestingEventsModule { }

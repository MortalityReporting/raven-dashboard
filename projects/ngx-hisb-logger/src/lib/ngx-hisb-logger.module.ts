import { NgModule } from '@angular/core';
import { NgxConsoleComponent } from './components/console/ngx-console.component';
import {AsyncPipe, CommonModule, JsonPipe} from "@angular/common";
import {LoggerService} from "./services/logger.service";
import {BrowserModule} from "@angular/platform-browser";



@NgModule({
  declarations: [
    NgxConsoleComponent
  ],
  imports: [
    JsonPipe,
    AsyncPipe,
    CommonModule,
    BrowserModule
  ],
  exports: [
    NgxConsoleComponent
  ],
  providers: [
   LoggerService
  ]
})
export class NgxHisbLoggerModule { }

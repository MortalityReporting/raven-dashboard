import {Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy} from '@angular/core';
import {EventModule} from "../../../models/event-module";
import {AppConfiguration} from "../../../../../providers/app-configuration";
import { MatButton } from '@angular/material/button';


@Component({
    selector: 'testing-event-registration-card',
    templateUrl: './event-registration-card.component.html',
    styleUrls: ['./event-registration-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatButton]
})
export class EventRegistrationCardComponent{
  @Input() event: EventModule;
  @Input() registered: boolean;
  @Output() registerClickEvent = new EventEmitter<EventModule>()

  appConfiguration: any = AppConfiguration.config;

  onClickRegister(event: EventModule) {
    this.registerClickEvent.emit(event);
  }

}

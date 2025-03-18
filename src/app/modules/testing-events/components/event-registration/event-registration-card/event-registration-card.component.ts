import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventModule} from "../../../models/event-module";
import {AppConfiguration} from "../../../../../providers/app-configuration";


@Component({
    selector: 'testing-event-registration-card',
    templateUrl: './event-registration-card.component.html',
    styleUrls: ['./event-registration-card.component.scss'],
    standalone: false
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

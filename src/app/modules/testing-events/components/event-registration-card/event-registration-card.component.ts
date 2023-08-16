import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventModule} from "../../models/event-module";

@Component({
  selector: 'testing-event-registration-card',
  templateUrl: './event-registration-card.component.html',
  styleUrls: ['./event-registration-card.component.scss']
})
export class EventRegistrationCardComponent implements OnInit{
  @Input() event: EventModule;
  @Input() registered: boolean;
  @Output() registerClickEvent = new EventEmitter<EventModule>()

  constructor() {
  }

  ngOnInit() {
    // console.log(this.event);
    // console.log(this.registered);
  }

  onClickRegister(event: EventModule) {
    this.registerClickEvent.emit(event);
  }
}

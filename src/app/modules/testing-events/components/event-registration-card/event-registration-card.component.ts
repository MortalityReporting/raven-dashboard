import {Component, Input} from '@angular/core';
import {EventModule} from "../../models/event-module";

@Component({
  selector: 'testing-event-registration-card',
  templateUrl: './event-registration-card.component.html',
  styleUrls: ['./event-registration-card.component.css']
})
export class EventRegistrationCardComponent {
  @Input() event: EventModule;
}

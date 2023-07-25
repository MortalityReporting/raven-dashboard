import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {EventRegistration} from "../../../user-management/models/event-registration";
import {EventItem} from "../../../user-management/models/event-item";

@Component({
  selector: 'app-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.scss']
})
export class TestContainerComponent {

  eventItem: EventItem;
  eventRegistration: EventRegistration;


  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation().extras.state
    this.eventItem = state['eventItem'];
    this.eventRegistration = state['eventRegistration'];
  }
}

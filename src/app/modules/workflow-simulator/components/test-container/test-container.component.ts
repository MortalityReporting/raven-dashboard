import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.css']
})
export class TestContainerComponent {
  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation().extras.state
    console.log(state);
  }
}

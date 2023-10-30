import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.css']
})
export class LoggedInComponent implements OnInit{
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.handleAuthCallback()
  }

  handleAuthCallback() {
    this.router.navigate(['/admin-panel']);
  }


}

import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-dcr-content-case-admin-info',
  standalone: false,
  templateUrl: './dcr-content-case-admin-info.component.html',
  styleUrl: './dcr-content-case-admin-info.component.css'
})
export class DcrContentCaseAdminInfoComponent {
  @Input() caseAdminInfo!: any;
}

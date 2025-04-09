import {Component, input} from '@angular/core';
import {CaseAdminInfo} from "../../../../models/dcr-record";


@Component({
  selector: 'app-dcr-content-case-admin-info',
  standalone: false,
  templateUrl: './dcr-content-case-admin-info.component.html',
  styleUrl: './dcr-content-case-admin-info.component.css'
})
export class DcrContentCaseAdminInfoComponent{
  caseAdminInfo = input<CaseAdminInfo>()
}

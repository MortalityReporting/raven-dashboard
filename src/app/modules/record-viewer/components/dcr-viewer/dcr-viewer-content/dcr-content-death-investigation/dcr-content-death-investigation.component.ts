import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-dcr-content-death-investigation',
  standalone: false,
  templateUrl: './dcr-content-death-investigation.component.html',
  styleUrl: './dcr-content-death-investigation.component.css'
})
export class DcrContentDeathInvestigationComponent{
  @Input() deathInvestigation!: any;
}

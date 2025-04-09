import {Component, input, Input} from '@angular/core';
import {DeathInvestigation} from "../../../../models/dcr-record";

@Component({
  selector: 'app-dcr-content-death-investigation',
  standalone: false,
  templateUrl: './dcr-content-death-investigation.component.html',
  styleUrl: './dcr-content-death-investigation.component.css'
})
export class DcrContentDeathInvestigationComponent{
  deathInvestigation = input<DeathInvestigation>();
}

import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [
    MatIcon,
    MatDivider,
    MatTooltip
  ],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent{
  isExpanded: boolean = true;
  mdiRecordsSectionExpanded = true;
  testingAndEventsSectionExpanded = true;
}

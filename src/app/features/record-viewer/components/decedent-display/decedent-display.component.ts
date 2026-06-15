import {Component, Inject, input} from '@angular/core';
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {ThemeService} from "../../../../service/theme.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-decedent-display',
  templateUrl: './decedent-display.component.html',
  styleUrls: ['./decedent-display.component.css'],
  imports: [
    DatePipe
  ]
})
export class DecedentDisplayComponent {
  decedentInformation = input<any>();
  type = input<string>("mdi-to-edrs");

  color: any;
  textColor: string;

  constructor(
    @Inject('config') public config: ModuleHeaderConfig,
    private themeService: ThemeService
) {
    this.color = config.backgroundColor;
    this.themeService.color$.subscribe(color => this.textColor = color);
  }

}

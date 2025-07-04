import {Component, Inject, Input} from '@angular/core';
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {ThemeService} from "../../../../service/theme.service";


@Component({
    selector: 'app-decedent-display',
    templateUrl: './decedent-display.component.html',
    styleUrls: ['./decedent-display.component.css'],
    standalone: false
})
export class DecedentDisplayComponent {
  @Input() decedentInformation: any;
  @Input() type: string = "mdi-to-edrs";

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

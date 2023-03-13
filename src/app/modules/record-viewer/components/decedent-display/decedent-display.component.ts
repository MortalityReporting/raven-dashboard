import {Component, Inject, Input} from '@angular/core';
import {ModuleHeaderConfig} from "../../../../../assets/configuration/module-header-config";
import {FhirExplorerDrawerService} from "../../../fhir-explorer/services/fhir-explorer-drawer.service";
import {ThemeService} from "../../../../service/theme.service";

@Component({
  selector: 'app-decedent-display',
  templateUrl: './decedent-display.component.html',
  styleUrls: ['./decedent-display.component.css']
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

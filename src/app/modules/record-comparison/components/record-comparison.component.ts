import {Component, Inject} from '@angular/core';
import {ModuleHeaderConfig} from "../../../providers/module-header-config";

@Component({
  selector: 'rc-record-comparison',
  templateUrl: './record-comparison.component.html',
  styleUrl: './record-comparison.component.scss'
})
export class RecordComparisonComponent {

  setRecordExpanded = true;

  constructor(
    @Inject('comparisonConfig') public config: ModuleHeaderConfig,
    ) {}
}

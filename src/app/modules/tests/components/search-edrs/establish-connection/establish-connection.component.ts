import {Component, Inject, OnInit} from '@angular/core';
import {SearchEdrsService} from "../../../services/search-edrs.service";
import {DecedentSimpleInfo} from "../../../../../model/decedent-simple-info";
import {ModuleHeaderConfig} from "../../../../../model/model-header-config";
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-establish-connection',
  templateUrl: './establish-connection.component.html',
  styleUrl: './establish-connection.component.css'
})
export class EstablishConnectionComponent implements OnInit {

  uiConstantsStep2: any;

  constructor(
    @Inject('workflowSimulatorConfig') public moduleConfig: ModuleHeaderConfig,
    private searchEdrsService: SearchEdrsService,
    private clipboard: Clipboard,
    uiStringConstants: UiStringConstants,
  ) {
    this.uiConstantsStep2 = uiStringConstants.WorkflowSimulator.searchEdrs.step2;
  }

  decedentInfo: DecedentSimpleInfo;
  bearerToken: string = '';

  ngOnInit(): void {
    this.searchEdrsService.decedentData$.subscribe({
      next: value => {
        this.decedentInfo = value;
      }
    });
  }

  protected readonly JSON = JSON;

  onCopyToClipboard(value: string) {
    this.clipboard.copy(value.trim())
  }
}

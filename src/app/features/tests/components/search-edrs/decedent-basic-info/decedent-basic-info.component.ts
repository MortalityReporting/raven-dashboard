import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UiStringConstants} from "../../../../../providers/ui-string-constants";
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-decedent-basic-info',
    templateUrl: './decedent-basic-info.component.html',
    styleUrls: ['./decedent-basic-info.component.scss'],
    imports: [MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatButton, DatePipe]
})
export class DecedentBasicInfoComponent implements OnInit {

  @Input() decedentInfo: any;
  @Input() expansionPanelEnabled: boolean = false;
  @Input() expansionPanelExpanded: boolean = true;
  @Input() btnEnabled: boolean = false;
  @Input() btnVisible: boolean = false;
  @Input() btnTitle: string = '';

  @Output() btnClick : EventEmitter<string> = new EventEmitter();
  uiConstants: any

  constructor(private uiStringConstants: UiStringConstants) {
    this.uiConstants = this.uiStringConstants.Common;
  }

  ngOnInit(): void {
  }


  onBtnClick() {
    this.btnClick.emit()
  }
}

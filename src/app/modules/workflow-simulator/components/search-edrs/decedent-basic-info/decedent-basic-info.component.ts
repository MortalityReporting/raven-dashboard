import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UiStringConstants} from "../../../../../providers/ui-string-constants";

@Component({
  selector: 'app-decedent-basic-info',
  templateUrl: './decedent-basic-info.component.html',
  styleUrls: ['./decedent-basic-info.component.scss']
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

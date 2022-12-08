import {Component, Input, OnInit} from '@angular/core';
import {UiStringConstants} from "../../../../../providers/ui-string-constants";

@Component({
  selector: 'app-decedent-basic-info',
  templateUrl: './decedent-basic-info.component.html',
  styleUrls: ['./decedent-basic-info.component.css']
})
export class DecedentBasicInfoComponent implements OnInit {

  @Input() decedentInfo: any;
  uiConstants: any

  constructor(private uiStringConstants: UiStringConstants) {
    this.uiConstants = this.uiStringConstants.Common;
  }

  ngOnInit(): void {
  }

}

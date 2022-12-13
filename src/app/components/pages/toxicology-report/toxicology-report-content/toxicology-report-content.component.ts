import { Component, OnInit } from '@angular/core';
import {ToxicologyHandlerService} from "../../../../service/toxicology-handler.service";

@Component({
  selector: 'app-toxicology-report-content',
  templateUrl: './toxicology-report-content.component.html',
  styleUrls: ['./toxicology-report-content.component.css']
})
export class ToxicologyReportContentComponent implements OnInit {

  constructor(
    private toxicologyHandler: ToxicologyHandlerService,
  ) { }

  ngOnInit(): void {
  }

}

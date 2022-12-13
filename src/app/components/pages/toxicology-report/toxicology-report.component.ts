import { Component, OnInit } from '@angular/core';
import {ToxicologyHandlerService} from "../../../service/toxicology-handler.service";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-toxicology-report',
  templateUrl: './toxicology-report.component.html',
  styleUrls: ['./toxicology-report.component.css']
})
export class ToxicologyReportComponent implements OnInit {

  messageBundle$: Observable<any>;
  toxHeader$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private toxicologyHandler: ToxicologyHandlerService,
  ) { }

  ngOnInit(): void {
    let toxLabId = this.route.snapshot.params['id'];
    this.messageBundle$ = this.toxicologyHandler.getMessageBundle(toxLabId);
    this.messageBundle$.subscribe(bundle => console.log(bundle));
    this.toxHeader$ = this.toxicologyHandler.toxHeader$;
  }

}

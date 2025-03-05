import { Component, OnInit } from '@angular/core';
import {SearchEdrsService} from "../../../../services/search-edrs.service";

export const APPLICATION_JSON = `application-json`;
export const POST = `POST`;

@Component({
    selector: 'app-http-request-info',
    templateUrl: './http-request-info.component.html',
    styleUrls: ['./http-request-info.component.scss'],
    standalone: false
})

export class HttpRequestInfoComponent implements OnInit {

  accept = APPLICATION_JSON;
  contentType = APPLICATION_JSON;
  requestMethod = POST;

  requestData: any

  constructor(private searchEdrsService: SearchEdrsService) { }

  ngOnInit(): void {
    this.searchEdrsService.edrsHttpRequestInfo$.subscribe({
      next: value =>
        this.requestData = value
    });
  }

}

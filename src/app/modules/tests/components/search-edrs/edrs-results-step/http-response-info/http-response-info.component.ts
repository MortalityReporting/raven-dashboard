import {Component, Input, OnInit} from '@angular/core';

export const APPLICATION_JSON = `application-json`;

@Component({
    selector: 'app-http-response-info',
    templateUrl: './http-response-info.component.html',
    styleUrls: ['./http-response-info.component.scss'],
    standalone: false
})
export class HttpResponseInfoComponent implements OnInit {
  @Input() successResponse;
  @Input() errorResponse;

  contentType = APPLICATION_JSON;

  constructor() { }

  ngOnInit(): void {
  }

  getStatusCode() {
    if(this.errorResponse){
      return this.errorResponse.status;
    }
    else if(this.successResponse){
      return "success";
    }
    else {
      return '';
    }
  }

}

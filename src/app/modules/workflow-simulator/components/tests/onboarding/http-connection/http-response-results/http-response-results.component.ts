import {Component, Input} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-http-response-results',
  templateUrl: './http-response-results.component.html',
  styleUrls: ['./http-response-results.component.scss']
})
export class HttpResponseResultsComponent {
  @Input() errorResponse: any;
  @Input() successResponse: any;
  @Input() request: any;

  constructor(private clipboard: Clipboard) {}

  copyToClipboard(object: any) {
    this.clipboard.copy(JSON.stringify(object))
  }

}

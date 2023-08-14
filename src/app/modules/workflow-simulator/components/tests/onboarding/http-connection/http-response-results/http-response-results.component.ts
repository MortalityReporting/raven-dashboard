import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {BasicNameValueType} from "../../../../../../../model/basic-name-value-type";

@Component({
  selector: 'app-http-response-results',
  templateUrl: './http-response-results.component.html',
  styleUrls: ['./http-response-results.component.scss']
})
export class HttpResponseResultsComponent  implements OnChanges {
  @Input() errorResponse: any;
  @Input() successResponse: any;
  @Input() request: any;

  successResponseTokens: any;

  constructor(private clipboard: Clipboard){}

  copyToClipboard(object: any) {
    this.clipboard.copy(JSON.stringify(object))
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.['successResponse']?.currentValue){
      this.successResponseTokens = this.getTokens(changes?.['successResponse']?.currentValue);
    }
  }

  /**
   * We search the response for any key containing the word "token" (such as "access-token")
   * and we render those to the user. We assume that these key-value pair contain important token information
   * @param response
   * @private
   */
  private getTokens(response: any): any {
    let result;
    const responseBody = response?.body;
    if(result){
    result = Object.keys(responseBody)
      .map(key => key.indexOf('token') != -1 ? { name: key, value : responseBody[key] } : null)
      .filter(item=> !!item);
    }
    return result;
  }
}

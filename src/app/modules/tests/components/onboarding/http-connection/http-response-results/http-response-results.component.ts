import {Component, computed, effect, input} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
    selector: 'app-http-response-results',
    templateUrl: './http-response-results.component.html',
    styleUrls: ['./http-response-results.component.scss'],
    standalone: false
})
export class HttpResponseResultsComponent {
  readonly errorResponse = input<any>();
  readonly successResponse = input<any>();
  readonly request = input<any>();

  protected readonly successResponseTokens = computed(() => {
    const response = this.successResponse();
    return response ? this.getTokens(response) : null;
  });

  constructor(private clipboard: Clipboard){}

  copyToClipboard(object: any) {
    this.clipboard.copy(object)
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
    if (responseBody) {
      result = Object.keys(responseBody)
        .map(key => key.indexOf('token') != -1 ? {name: key, value: responseBody[key]} : null)
        .filter(item => !!item);
    }
    return result;
  }
}

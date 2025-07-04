import {Component, Input} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'common-error-frame',
    templateUrl: './error-frame.component.html',
    styleUrls: ['./error-frame.component.scss'],
    standalone: false
})
export class ErrorFrameComponent {
  @Input() error: HttpErrorResponse;
  Object = Object;

  getTypeOf(errorBody) {
    return typeof errorBody;
  }
}

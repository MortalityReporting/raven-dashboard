import {Component, Input} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

@Component({
    selector: 'common-error-frame',
    templateUrl: './error-frame.component.html',
    styleUrls: ['./error-frame.component.scss'],
    imports: [
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule
    ]
})
export class ErrorFrameComponent {
  @Input() error: HttpErrorResponse;
  Object = Object;

  getTypeOf(errorBody) {
    return typeof errorBody;
  }
}

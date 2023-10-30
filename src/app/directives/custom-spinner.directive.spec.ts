import { CustomSpinnerDirective } from '../modules/record-viewer/directives/custom-spinner.directive';
import {ElementRef} from "@angular/core";

describe('CustomSpinnerDirective', () => {
  it('should create an instance', () => {
    const directive = new CustomSpinnerDirective(new ElementRef<any>({}));
    expect(directive).toBeTruthy();
  });
});

import {ChangeDetectorRef, Component, computed, effect, inject, input, Signal} from '@angular/core';

import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {SharedHttpErrorService} from "../../service/shared-http-error.service";

@Component({
  selector: 'app-error-message',
  imports: [
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent {
  protected sharedHttpErrorService = inject(SharedHttpErrorService);
  private cdr = inject(ChangeDetectorRef);
  readonly defaultErrorMessage = 'HTTP Server Error Detected';

  /**
   * Optional component name input to identify where this error component is rendered.
   * - If provided: Shows errors only when targetComponent matches this componentName
   * - If not provided (null): Shows errors only when targetComponent is null (main page)
   */
  componentName = input<string | null>(null);

  // Use a simple boolean property for visibility
  protected isVisible = false;

  constructor() {
    // Update visibility whenever error state changes
    effect(() => {
      const error = this.sharedHttpErrorService.errorDetected();
      const targetComponent = this.sharedHttpErrorService.targetComponent();
      const componentName = this.componentName();

      // Show error if:
      // 1. An error exists, AND
      // 2. The target component matches this component's name
      //    - If this component has no name (null), show when target is null (main page)
      //    - If this component has a name, show when target matches that name
      this.isVisible = error && targetComponent === componentName;

      // Force change detection to update the template immediately
      this.cdr.detectChanges();
    });
  }

  protected readonly errorMessage: Signal<string> = computed(() =>
    this.sharedHttpErrorService.errorMessage() || this.defaultErrorMessage
  );

  close() {
    this.sharedHttpErrorService.hideErrorComponent();
  }
}

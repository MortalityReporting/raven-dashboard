import {Directive, HostListener, Input} from '@angular/core';
import {BundleHelperService} from "../../fhir-util";
import {FhirExplorerService} from "../services/fhir-explorer.service";

@Directive({
  selector: '[appSetFhirExplorer]'
})
export class SetFhirExplorerDirective {
  @Input() bundle: any;
  @Input() profile: string;
  @Input() resourceId: string;
  @Input() resource: any;

  /**
   * Priority order:
   * 1. resource - Resource is passed whole.
   * 2. bundle + Id - Resource is found in the bundle by ID.
   * 3. bundle + profile - SINGLETON PROFILES ONLY - Resource is found in the bundle by Profile.
   * **/
  @HostListener('click', ['$event']) onClick(event: any) {
    if (this.resource) {
      this.fhirExplorerService.setSelectedFhirResource(this.resource);
    }
    else if (!this.bundle) {
      throw new Error(`Bundle input required if passing [resourceId] or [profile].`)
    }
    else if (this.resourceId) {
      this.fhirExplorerService.setSelectedFhirResource(this.bundleHelper.findResourceByFullUrl(this.bundle, this.resourceId));
    }
    else if (this.profile) {
      this.fhirExplorerService.setSelectedFhirResource(this.bundleHelper.findResourceByProfileName(this.bundle, this.profile));
    }
    else {
      throw new Error(`Missing inputs. Possible Combinations: [resource], [resourceId] + [bundle], [profile] + [bundle].`)
    }
  }

  constructor(private fhirExplorerService: FhirExplorerService,
              private bundleHelper: BundleHelperService) {}
}

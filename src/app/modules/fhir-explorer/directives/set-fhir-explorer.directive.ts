import {Directive, HostListener, Input} from '@angular/core';
import {DocumentHandlerService} from "../../record-viewer/services/document-handler.service";
import {BundleHelperService} from "../../fhir-util/services/bundle-helper.service";
import {FhirExplorerService} from "../services/fhir-explorer.service";

@Directive({
  selector: '[appSetFhirExplorer]'
})
export class SetFhirExplorerDirective {
  @Input() profile: string;
  @Input() title: string;
  @Input() observation: string;
  @Input() resource: any;
  @Input() type: string = "mdi-to-edrs"; // TODO: Setup as enum.
  @Input() bundle: any;

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
    else if (this.profile) {
      // if (!this.bundle) throw new Error();
      // TODO: Refactor to provide the bundle to the directives so this is not needed...
      if (this.type === "tox-to-mdi") {
        this.fhirExplorerService.setSelectedFhirResource(this.bundleHelper.findResourceByProfileName(this.bundle, this.profile));
      }
      else {
        //this.fhirExplorerService.setSelectedFhirResource(this.bundleHelper.findResourceByProfileName(this.bundle, this.profile));
        this.fhirExplorerService.setSelectedFhirResource(this.documentHandler.findResourceByProfileNamePassThrough(this.profile));
      }
    }
    else if (this.observation) {
      // TODO: Refactor to provide the bundle to the directives so this is not needed...
      console.error("Remove any calls to this. (OBSERVATION)");
      this.fhirExplorerService.setSelectedFhirResource(this.bundleHelper.findResourceByFullUrl(this.documentHandler.getCurrentDocumentBundle(), this.observation));
    }
    else if (this.title) {
      // TODO: Remove this once cleaned up.
      console.error("Remove any calls to this. (TITLE)");
      switch (this.title) {
        case "certifier":
          this.fhirExplorerService.setSelectedFhirResource(this.documentHandler.getCertifier());
          break;
        case "subject":
          this.fhirExplorerService.setSelectedFhirResource(this.documentHandler.getCurrentSubjectResource());
          break;
        case "document":
          this.fhirExplorerService.setSelectedFhirResource(this.documentHandler.getCurrentDocumentBundle());
          break;
      }
    }
  }

  constructor(private fhirExplorerService: FhirExplorerService,
              private documentHandler: DocumentHandlerService, // TODO: Remove
              private bundleHelper: BundleHelperService) { }

}

import {Directive, HostListener, Input} from '@angular/core';
import {FhirResourceProviderService} from "../../../service/fhir-resource-provider.service";
import {DocumentHandlerService} from "../../record-viewer/services/document-handler.service";
import {BundleHelperService} from "../../fhir-util/services/bundle-helper.service";
import {ToxicologyHandlerService} from "../../record-viewer/services/toxicology-handler.service";

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

  @HostListener('click', ['$event']) onClick(event: any) {
    if (this.resource) {
      this.fhirResourceProvider.setSelectedFhirResource(this.resource);
    }
    else if (this.profile) {
      // if (!this.bundle) throw new Error();
      // TODO: Refactor to provide the bundle to the directives so this is not needed...
      if (this.type === "tox-to-mdi") {
        this.fhirResourceProvider.setSelectedFhirResource(this.bundleHelper.findResourceByProfileName(this.bundle, this.profile));
      }
      else {
        //this.fhirResourceProvider.setSelectedFhirResource(this.bundleHelper.findResourceByProfileName(this.bundle, this.profile));
        this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.findResourceByProfileNamePassThrough(this.profile));
      }
    }
    else if (this.observation)
    {
      // TODO: Refactor to provide the bundle to the directives so this is not needed...
      this.fhirResourceProvider.setSelectedFhirResource(this.bundleHelper.findResourceByFullUrl(this.documentHandler.getCurrentDocumentBundle(), this.observation));
    }
    else if (this.title) {
      switch (this.title) {
        case "certifier":
          this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.getCertifier());
          break;
        case "subject":
          this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.getCurrentSubjectResource());
          break;
        case "document":
          this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.getCurrentDocumentBundle());
          break;
      }
    }
  }

  constructor(private fhirResourceProvider: FhirResourceProviderService,
              private documentHandler: DocumentHandlerService,
              private bundleHelper: BundleHelperService
  ) { }

}

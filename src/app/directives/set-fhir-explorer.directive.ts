import {Directive, HostListener, Input} from '@angular/core';
import {FhirResourceProviderService} from "../service/fhir-resource-provider.service";
import {DocumentHandlerService} from "../service/document-handler.service";

@Directive({
  selector: '[appSetFhirExplorer]'
})
export class SetFhirExplorerDirective {
  @Input() profile: string;
  @Input() title: string;
  @Input() observation: string;
  @Input() resource: any;

  @HostListener('click', ['$event']) onClick(event: any) {
    console.log(event);
    console.log(this.title);
    console.log(this.profile);
    if (this.resource) {
      this.fhirResourceProvider.setSelectedFhirResource(this.resource);
    }
    else if (this.profile) {
      // TODO: Refactor to provide the bundle to the directive so this is not needed...
      this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.findResourceByProfileNamePassThrough(this.profile));
    }
    else if (this.observation)
    {
      // TODO: Refactor to provide the bundle to the directive so this is not needed...
      this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.findResourceByProfileNamePassThrough(this.observation));
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
              private documentHandler: DocumentHandlerService
              ) { }

}

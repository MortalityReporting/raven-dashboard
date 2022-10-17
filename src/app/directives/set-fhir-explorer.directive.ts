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

  @HostListener('click', ['$event']) onClick(event: any) {
    console.log(event);
    console.log(this.title);
    console.log(this.profile);
    if (this.profile) {
      this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.findResourceByProfileName(undefined, this.profile));
    }
    else if (this.observation)
    {
      this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.findResourceById(undefined, this.observation));
    }
    else if (this.title) {
      switch (this.title) {
        case "deathLocation":
          let circumstancesSection = this.documentHandler.getSection(undefined, "circumstances");
          let deathLocationResource = this.documentHandler.findDeathLocation(undefined, undefined, circumstancesSection);
          this.fhirResourceProvider.setSelectedFhirResource(deathLocationResource);
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

  constructor(private fhirResourceProvider: FhirResourceProviderService, private documentHandler: DocumentHandlerService) { }

}

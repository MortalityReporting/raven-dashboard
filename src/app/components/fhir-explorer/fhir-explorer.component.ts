import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FhirResource} from "../../model/fhir/fhir.resource";
import {FhirResourceProviderService} from "../../service/fhir-resource-provider.service";
import {HttpClient} from "@angular/common/http";
import {DocumentHandlerService} from "../../service/document-handler.service";
import {FhirExplorerService} from 'src/app/service/fhir-explorer.service';
import {UtilsService} from "../../service/utils.service";

@Component({
  selector: 'app-fhir-explorer',
  templateUrl: './fhir-explorer.component.html',
  styleUrls: ['./fhir-explorer.component.css']
})
export class FhirExplorerComponent implements OnInit {

  formattedText: string;
  fhirResource: FhirResource;
  selectedStructure: string = 'json';
  fhirResource$: Observable<FhirResource>; // TODO: For Testing, remove.

  constructor(
    private httpClient: HttpClient,
    private documentHandler: DocumentHandlerService,
    private fhirExplorerService: FhirExplorerService,
    private fhirResourceProvider: FhirResourceProviderService,
    private utilsService: UtilsService
  ) {
      this.fhirResourceProvider.fhirResource$.subscribe( resource => {

      this.fhirResource = resource;
      if(this.selectedStructure === "narrative"){
        this.formattedText = this.documentHandler.getCurrentSubjectResource().text.div;
      }
      else if (this.selectedStructure === "xml") {
        this.fhirExplorerService.translateToXml( this.fhirResource ).subscribe( response => {
          this.formattedText = response;
        })
      }
      else {
        this.formattedText = JSON.stringify( resource, null, 2 );
      }
    })
  };

  ngOnInit(): void {
  }

  isNarrative() : boolean {
    return this.selectedStructure === 'narrative';
  }

  onToggleClick() {
    if (this.selectedStructure === "narrative") {
      this.formattedText = this.documentHandler.getCurrentSubjectResource().text.div;
    }
    else {
      this.fhirResourceProvider.setSelectedFhirResource(this.documentHandler.getCurrentSubjectResource());
    }
  }

  onCopyToClipboard(formattedText: string) {
    this.utilsService.showSuccessMessage("Content copied to clipboard.")
  }
}

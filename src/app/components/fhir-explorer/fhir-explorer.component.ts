import {Component, OnInit, ElementRef} from '@angular/core';
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
  fhirResource: any;
  selectedStructure: string = "narrative";
  isLoadingXMLData = false;

  constructor(
    private httpClient: HttpClient,
    private documentHandler: DocumentHandlerService,
    private fhirExplorerService: FhirExplorerService,
    private fhirResourceProvider: FhirResourceProviderService,
    private utilsService: UtilsService,
    private elRef: ElementRef
  ) {
      this.fhirResourceProvider.fhirResource$.subscribe( resource => {

      this.fhirResource = resource;

      if(!this.fhirResource){
        this.formattedText = '';
      }
      else if(this.selectedStructure == "narrative"){
        // TODO, not sure where this comes from
        //this.formattedText = this.documentHandler.getCurrentSubjectResource()?.text?.div;
        this.formattedText = this.fhirResource?.text?.div;
      }
      else if (this.selectedStructure === "xml") {
        this.isLoadingXMLData = true;
        this.fhirExplorerService.translateToXml( this.fhirResource ).subscribe( response => {
          this.formattedText = response;
          this.isLoadingXMLData = false;
        })
      }
      else {
        this.formattedText = JSON.stringify( resource, null, 2 );
      }

      this.elRef.nativeElement.parentElement.parentElement.scrollTo(0, 0);

    })
  };

  ngOnInit(): void {

  }


  isNarrative() : boolean {
    return this.selectedStructure === 'narrative';
  }

  onToggleClick() {
    if (this.selectedStructure === "narrative") {
      this.formattedText = this.fhirResource?.text?.div;
      //this.formattedText = this.documentHandler.getCurrentSubjectResource().text.div;
    }
    else {
      // TODO not sure why this is a good idea and we need to fix this code ASAP !!!
      // This should do the translation we are doing in the constructor
      const resource = this.documentHandler.getCurrentSubjectResource();
      this.fhirResourceProvider.setSelectedFhirResource(this.fhirResource);
    }
  }

  onCopyToClipboard(formattedText: string) {
    this.utilsService.showSuccessMessage("Content copied to clipboard.")
  }
}

import {Component, OnInit, ElementRef} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UtilsService} from "../../../../service/utils.service";
import {FhirExplorerService} from "../../services/fhir-explorer.service";

@Component({
  selector: 'app-fhir-explorer',
  templateUrl: './fhir-explorer.component.html',
  styleUrls: ['./fhir-explorer.component.scss']
})
export class FhirExplorerComponent implements OnInit {

  formattedText: string;
  fhirResource: any;
  selectedStructure: string = "narrative";
  isLoadingXMLData = false;

  constructor(
    private httpClient: HttpClient,
    private fhirExplorerService: FhirExplorerService,
    private utilsService: UtilsService,
    private elRef: ElementRef
  ) {
      this.fhirExplorerService.fhirResource$.subscribe( resource => {
      this.fhirResource = resource;

      if(!this.fhirResource){
        this.formattedText = '';
      }
      else if(this.selectedStructure == "narrative"){
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
    //If no narrative is found, render the JSON when the resource is first open
    if(this.fhirResource?.text?.div){
      this.formattedText = this.fhirResource?.text?.div;
    }
    else {
      this.selectedStructure = "json";
      this.formattedText = JSON.stringify( this.fhirResource, null, 2 );
      this.elRef.nativeElement.parentElement.parentElement.scrollTo(0, 0);
    }
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
      this.fhirExplorerService.setSelectedFhirResource(this.fhirResource);
    }
  }

  onCopyToClipboard(formattedText: string) {
    this.utilsService.showSuccessMessage("Content copied to clipboard.")
  }
}

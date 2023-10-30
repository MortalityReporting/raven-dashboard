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
  };

  ngOnInit(): void {
    this.fhirExplorerService.fhirResource$.subscribe( resource => {
      this.fhirResource = resource;

      if(!this.fhirResource){
        this.formattedText = '';
      }
      else if(this.selectedStructure == "narrative"){
        if(this.fhirResource?.text?.div){
          this.formattedText = this.fhirResource?.text?.div;
        }
        else {
          this.selectedStructure = "json";
          this.formattedText = JSON.stringify( resource, null, 2 );
        }
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
  }


  isNarrative() : boolean {
    return this.selectedStructure === 'narrative';
  }

  onToggleClick() {
    if (this.selectedStructure === "narrative") {
      this.formattedText = this.fhirResource?.text?.div;
    }
    else {
      this.fhirExplorerService.setSelectedFhirResource(this.fhirResource);
    }
  }

  onCopyToClipboard(formattedText: string) {
    this.utilsService.showSuccessMessage("Content copied to clipboard.")
  }
}

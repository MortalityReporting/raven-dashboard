import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from "../../../service/utils.service";

@Component({
  selector: 'app-fhir-validator-js',
  templateUrl: './fhir-validator-js.component.html',
  styleUrls: ['./fhir-validator-js.component.css']
})
export class FhirValidatorJsComponent implements OnInit {
  fhirResource: string ='';
  resourceFormat = 'json';
  errorMessage: string;
  fileName: string;

  constructor(
    private utilsService: UtilsService
  ) { }

  // It is important the format is working with "best effort"
  // That is it may or may not format the text properly and require extensive testing to validate it's operation.
  onFormatInput() {
    if(this.fhirResource
      && (this.utilsService.isXmlString(this.fhirResource) || this.utilsService.isJsonString(this.fhirResource)))
    {
      if(this.resourceFormat === 'json' && this.utilsService.isJsonString(this.fhirResource)){
        this.fhirResource = this.utilsService.beautifyJSON(this.fhirResource);
      }
      else if(this.resourceFormat === 'xml' && this.utilsService.isXmlString(this.fhirResource)){
        this.fhirResource = this.utilsService.beautifyXML(this.fhirResource);
        console.log(this.fhirResource);
      }
    }
    this.fhirResource = this.utilsService.beautifyXML(this.fhirResource);
  }

  ngOnInit(): void {
  }

  isEnabledFormatInputBtn(): boolean {
    return !!this.fhirResource
      && (this.utilsService.isXmlString(this.fhirResource) || this.utilsService.isJsonString(this.fhirResource));
  }

  onFileSelected(event: any) {
    const file:File = event.target.files[0];

    if (file) {

      // auto toggle the file type radio buttons
      if (file.type === "text/xml"){
        this.resourceFormat = 'xml';
      }
      else if ("application/json"){
        this.resourceFormat = 'json';
      }

      // set the filename in the UI
      this.fileName = file.name;

      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = () => {
        this.fhirResource = reader.result as string;
      }
      reader.onerror = function (evt) {
        console.log("error");
      }

    }
    else {
      console.log("error reading the file");
      console.log(file);
    }
  }
}

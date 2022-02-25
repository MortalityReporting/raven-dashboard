import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from "../../../service/utils.service";
import {FhirValidatorService} from "../../../service/fhir-validator.service";

@Component({
  selector: 'app-fhir-validator-js',
  templateUrl: './fhir-validator-js.component.html',
  styleUrls: ['./fhir-validator-js.component.css']
})
export class FhirValidatorJsComponent implements OnInit {
  fhirResource: string ='';
  resourceFormat = 'json';
  fileName: string;
  validationErrorPresent: false;
  validationErrorStr: string;
  isValidResourceMsgRendered = false;
  isUnableToFormatTextMsgRendered = false;

  constructor(
    private utilsService: UtilsService,
    private fhirValidatorService: FhirValidatorService
  ) { }

  // It is important the format is working with "best effort"
  // That is it may or may not format the text properly and require extensive testing to validate its operation.
  onFormatInput() {
    if(this.fhirResource
      && (this.utilsService.isXmlString(this.fhirResource) || this.utilsService.isJsonString(this.fhirResource)))
      {
        if(this.resourceFormat === 'json' && this.utilsService.isJsonString(this.fhirResource)){
          this.fhirResource = this.utilsService.beautifyJSON(this.fhirResource);
        }
        else if(this.resourceFormat === 'xml' && this.utilsService.isXmlString(this.fhirResource)){
          this.fhirResource = this.utilsService.beautifyXML(this.fhirResource);
        }
        else {
          this.isUnableToFormatTextMsgRendered = true;
        }
    }
    else {
      this.isUnableToFormatTextMsgRendered = true;
    }
  }

  ngOnInit(): void {
  }

  clearUI(){
    this.fhirResource='';
    this.fileName=''
    this.isValidResourceMsgRendered = false;
    this.validationErrorStr = '';
    this.isUnableToFormatTextMsgRendered = false;
  }

  onClear(){
    this.clearUI();
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

  validateFhirResource(fhirResource: any, resourceFormat: string) {
    this.isUnableToFormatTextMsgRendered = false;
    this.validationErrorStr = this.fhirValidatorService.getUiValidationMessages(fhirResource, resourceFormat);
    if(this.validationErrorStr){
      this.isValidResourceMsgRendered = false;
    }
    else {
      this.isValidResourceMsgRendered = true;
    }

  }

  onPasteFhirResource(event: ClipboardEvent) {
    // If not text is present in the textarea (this.fhirResource is empty) we toggle the  radio buttons
    // based on the input text format.
    if(!this.fhirResource) {
      this.clearUI();
      let text = event.clipboardData.getData('text');
      if (this.utilsService.isJsonString(text)) {
        this.resourceFormat = 'json';
      } else if (this.utilsService.isXmlString(text)) {
        this.resourceFormat = 'xml';
      }
    }
  }
}

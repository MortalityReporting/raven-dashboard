import { Component, OnInit } from '@angular/core';
import {UtilsService} from "../../../service/utils.service";

@Component({
  selector: 'app-fhir-validator-js',
  templateUrl: './fhir-validator-js.component.html',
  styleUrls: ['./fhir-validator-js.component.css']
})
export class FhirValidatorJsComponent implements OnInit {
  fhirResource: string ='';

  constructor(
    private utilsService: UtilsService
  ) { }

  onFormatInput() {
      this.fhirResource = this.utilsService.beautifyJSON(this.fhirResource);
      console.log(this.fhirResource);
  }

  ngOnInit(): void {
  }

}

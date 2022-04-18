import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fhir-explorer',
  templateUrl: './fhir-explorer.component.html',
  styleUrls: ['./fhir-explorer.component.css']
})
export class FhirExplorerComponent implements OnInit {

  selectedStructure: string = 'json';

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import-case',
  templateUrl: './import-case.component.html',
  styleUrls: ['./import-case.component.css']
})



export class ImportCaseComponent implements OnInit {

  fileName: string;
  isLoading: boolean = false;
  inputOptions: string[] = ['Fhir Record', 'Template File'];
  selectedInputOption: string = 'Fhir Record';

  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {

  }

  clearUI() {
    // TODO reset the UI to it's initial state.
  }
}

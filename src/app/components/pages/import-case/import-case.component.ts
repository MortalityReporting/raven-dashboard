import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-import-case',
  templateUrl: './import-case.component.html',
  styleUrls: ['./import-case.component.css']
})

export class ImportCaseComponent implements OnInit {

  inputOptions: string[] = ['FHIR Record', 'Connectathon Template(.XLS File)'];
  selectedInputOption: string = this.inputOptions[0];

  constructor() { }

  ngOnInit(): void {
  }

}

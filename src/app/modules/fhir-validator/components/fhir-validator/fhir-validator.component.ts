import {Component, Inject} from '@angular/core';
import {ValidatorInput} from "ngx-fhir-validator";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import autoTable from 'jspdf-autotable'
import jsPDF from "jspdf";

@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.scss']
})
export class FhirValidatorComponent {
  constructor(
    @Inject('fhirValidatorConfig') public config: ModuleHeaderConfig) {
  }

  exportToPDF(data: any): void {
    const doc: jsPDF = new jsPDF();
    let date = new Date().toUTCString();
    const reportTitle = "FHIR Validator Results";
    doc.setFontSize(6);
    doc.setTextColor(119, 119, 119);
    doc.text(date, 160, 12);
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(reportTitle, 14, 12);
    autoTable(doc, {
      columnStyles: {
        severity: {halign: 'left'},
        diagnostics: {halign: 'left'},
        location: {halign: 'left', cellWidth: 25}
      }, // European countries centered
      body: data,
      columns: [
        {header: 'Severity', dataKey: 'severity'},
        {header: 'Diagnostics', dataKey: 'diagnostics'},
        {header: 'Location', dataKey: 'location'},
      ],
      styles: {fontSize: 8, fontStyle: "normal"},
    });
    try {
      doc.save(`${reportTitle}_${date}.pdf`);
    } catch (err) {
      console.error(err);
    }
  }

  validationTextFormat: ValidatorInput = {format: 'xml and json', accepts: 'text/*,.xml,.json'};

  onExportToPdf(data: any) {
    this.exportToPDF(data);
  }

}

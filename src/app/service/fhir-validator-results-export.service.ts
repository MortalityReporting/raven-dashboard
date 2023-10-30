import { Injectable } from '@angular/core';
import JSZip from "jszip";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// TODO: We should try to extract this service into the FHIR Validator Library module.
// However, when we attempted, the libraries JSZip and autoTable did not export properly.

@Injectable({
  providedIn: 'root'
})
export class FhirValidatorResultsExportService {
  constructor() { }

  async exportToPdf(jsonResource, pdfReportData: any) {
    let zip = new JSZip();

    zip.file(`resource.json`, jsonResource);

    //Add the contents of fhir-validator README.md
    const response = await fetch('assets/files/fhir-validator/README.md');
    const fileContent = await response.text();
    zip.file('README.md', fileContent);

    const pdfBlob = this.generateAutoTablePDF(pdfReportData);
    zip.file('fhir_validator_report.pdf', pdfBlob);

    // Create the zip and trigger download
    zip.generateAsync({type: 'blob'}).then((content) => {
      // Create a blob for the zip content
      const blob = new Blob([content], {type: 'application/zip'});

      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = `validator_results_${this.toInYyyyMmDdHhMmSs(new Date())}.zip`;

      // Trigger the download
      downloadLink.click();
      downloadLink.remove()
    });

  }

  /**
   * Helper function for formatting a date.
   * For more information see https://trymysolution.medium.com/javascript-date-as-in-yyyy-mm-dd-hh-mm-ss-format-or-mm-dd-yyyy-hh-mm-ss-a0c96e8fa888
   * @param date
   * @param dateDiveder
   */
  private toInYyyyMmDdHhMmSs(date: Date, dateDiveder: string = "-") {
    return (
      [
        date.getFullYear(),
        this.padTwoDigits(date.getMonth() + 1),
        this.padTwoDigits(date.getDate()),
      ].join(dateDiveder) +
      " " +
      [
        this.padTwoDigits(date.getHours()),
        this.padTwoDigits(date.getMinutes()),
        this.padTwoDigits(date.getSeconds()),
      ].join(":")
    );
  }

  /**
   * Helper function for toInYyyyMmDdHhMmSs function
   * @param num
   * @private
   */
  private padTwoDigits(num: number) {
    return num.toString().padStart(2, "0");
  }

  generateAutoTablePDF(data: any) {
    let pdf = new jsPDF();
    const reportTitle = "FHIR Validator Results";
    pdf.setFontSize(6);
    pdf.setTextColor(119, 119, 119);
    pdf.text(this.toInYyyyMmDdHhMmSs(new Date()), 170, 12);
    pdf.setFontSize(12);
    pdf.setTextColor(50, 50, 50);
    pdf.text(reportTitle, 14, 12);


    autoTable(pdf, {
      columnStyles: {
        severity: {halign: 'left', cellWidth: 25},
        fhirPath: {halign: 'left', cellWidth: 50},
        diagnostics: {halign: 'left'},
        location: {halign: 'left', cellWidth: 25}
      }, // European countries centered
      body: data,
      columns: [
        {header: 'Severity', dataKey: 'severity'},
        {header: 'FHIR Path', dataKey: 'fhirPath'},
        {header: 'Diagnostics', dataKey: 'diagnostics'},
        {header: 'Location', dataKey: 'location'},
      ],
      styles: {fontSize: 8, fontStyle: "normal"},
    });
    return new Blob([pdf.output('blob')], {type: 'application/pdf'});
  }
}

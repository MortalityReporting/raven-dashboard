import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, map, mergeMap} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {ToxicologyHandlerService} from "../../../services/toxicology-handler.service";
import {ToxicologyGridDto} from "../../../../../model/toxicology.grid.dto";
import {TrackingNumberType} from "../../../../../model/tracking.number.type";

@Component({
  selector: 'record-viewer-toxicology-grid',
  templateUrl: './toxicology-grid.component.html',
  styleUrls: ['../search-records.component.scss']
})
export class ToxicologyGridComponent implements OnInit {


  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['lastName', 'reportdate', 'toxcasenumber', 'toxcasesystem', 'mdicasenumber', 'mdicasesystem'];
  toxGridDtoList: ToxicologyGridDto[];
  isLoading = true;
  showSystems = false;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private toxicologyHandler: ToxicologyHandlerService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;

    // TODO: Add logic to skip invalid records missing either a subject or tox tracking number.
    this.toxicologyHandler.getToxicologyRecords().pipe(
      mergeMap((diagnosticReportList: any[]) =>
        forkJoin(
          // IMPORTANT: Each list item is not a DiagnosticReport, but a bundle entry component wrapping one.
          diagnosticReportList.map((diagnosticReportBec: any, i) =>
            this.toxicologyHandler.getSubject(diagnosticReportBec.resource).pipe(
              map((subject: any) => {
                let diagnosticReportDto = this.mapToDto(diagnosticReportBec.resource, subject);
                return diagnosticReportDto;
              })
            )
          ))
      )
    ).subscribe({
      next: (data) => {
        this.toxGridDtoList = []//data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;
        //TODO render error message to the user
      },
      complete:  () => {
        this.isLoading = false
      }
    });
  }

  // This function requires the diagnosticReport resource, not the bundle entry component.
  mapToDto(diagnosticReport: any, subject: any): ToxicologyGridDto {
    let toxDto = new ToxicologyGridDto();
    toxDto.firstName = subject?.name[0]?.given[0];
    toxDto.lastName = subject?.name[0]?.family;
    toxDto.reportdate = diagnosticReport?.issued
    const toxTrackingNumber = this.toxicologyHandler.getTrackingNumber(diagnosticReport, TrackingNumberType.Tox);
    const mdiTrackingNumber = this.toxicologyHandler.getTrackingNumber(diagnosticReport, TrackingNumberType.Mdi);
    toxDto.toxcasenumber = toxTrackingNumber?.value || undefined;
    toxDto.toxcasesystem = toxTrackingNumber?.system || undefined;
    toxDto.mdicasenumber = mdiTrackingNumber?.value || undefined;
    toxDto.mdicasesystem = mdiTrackingNumber?.system || undefined
    return toxDto;
  }

  onCaseSelected(row: any) {
    this.router.navigate(['records/tox/', row.toxcasesystem + "|" + row.toxcasenumber]);
  }

  pageChanged(event: PageEvent) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {DecedentGridDTO} from "../../../../model/decedent.grid.dto";
import {DecedentService} from "../../../../service/decedent.service";
import {ActivatedRoute, Router} from "@angular/router";
import {mergeMap, forkJoin, map} from "rxjs";
import {UtilsService} from "../../../../service/utils.service";
import {MatSelect} from "@angular/material/select";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-decedent-records-grid',
  templateUrl: './decedent-records-grid.component.html',
  styleUrls: ['../cases.component.css']
})
export class DecedentRecordsGridComponent implements OnInit {

  @ViewChild('mannerOfDeathSelect') mannerOfDeathSelect: MatSelect;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['index', 'officialName', 'gender', 'tod', 'mannerOfDeath', 'caseNumber'];
  decedentGridDtoList: DecedentGridDTO[];
  isLoading = true;
  mannerOfDeathList: string [] = [];
  pipe: DatePipe;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    private router: Router,
    private utilsService: UtilsService,
  ) {
  }

  mapToDto(entry: any): DecedentGridDTO {
    let decedentDTO = new DecedentGridDTO();
    decedentDTO.decedentId = entry.resource?.id;
    decedentDTO.firstName = entry.resource?.name?.[0]?.given[0];
    decedentDTO.lastName = entry.resource?.name?.[0]?.family;
    decedentDTO.gender = entry.resource?.gender;
    decedentDTO.system = entry.resource?.identifier?.[0]?.system || null;
    decedentDTO.age = this.getAgeFromDob(new Date(entry.resource?.birthDate));
    return decedentDTO;
  }

  ngOnInit(): void {
    const loincCauseOfDeath = '69449-7';
    const loincTimeOfDeath = '81956-5';
    const codes = [loincCauseOfDeath, loincTimeOfDeath];
    this.isLoading = true;

    this.decedentService.getDecedentRecords().pipe(
      mergeMap((decedentRecordsList: any[]) =>
        forkJoin(
          decedentRecordsList.map((decedentRecord: any, i) =>

            this.decedentService.getDecedentObservationsByCode(decedentRecord, codes).pipe(
              map((observation: any) => {
                decedentRecord = this.mapToDto(decedentRecord);
                const tod = observation?.entry?.find(entry => entry.resource?.code?.coding[0]?.code == loincTimeOfDeath)?.resource?.valueDateTime;
                decedentRecord.tod = tod;
                const mannerOfDeath =  observation?.entry?.find(entry => entry.resource?.code?.coding?.[0]?.code == loincCauseOfDeath)?.resource?.valueCodeableConcept?.coding?.[0]?.display;
                decedentRecord.mannerOfDeath = mannerOfDeath;
                decedentRecord.index = i + 1;
                return decedentRecord;
              })
            )
          ))
      )
    ).pipe(
      mergeMap((decedentRecordsList: any[]) =>
        forkJoin(
          decedentRecordsList.map((decedentRecord: any, i) =>
              this.decedentService.getComposition(decedentRecord.decedentId).pipe(
              map((searchset: any) => {
                const caseNumber = searchset?.entry?.[0]?.resource?.extension?.[0]?.valueIdentifier?.value;
                decedentRecord.caseNumber = caseNumber;
                return decedentRecord
              })
            )
          ))
      )
    )
    .subscribe({
        next: (data) => {
          this.decedentGridDtoList = data.filter(record => !!record.caseNumber);
          this.dataSource = new MatTableDataSource(this.decedentGridDtoList);
          this.dataSource.sort = this.sort;
          this.mannerOfDeathList = this.getMannerOfDeathList(this.decedentGridDtoList);
          this.setDataSourceFilters();
        },
        error: (e) => {
          this.isLoading = false;
          console.error(e);
          this.utilsService.showErrorMessage();
        },
        complete:  () => {
          this.isLoading = false;
          //TODO render error message to the user
        },
    });
  }

  onCaseSelected(row: any) {
    this.router.navigate(['records/mdi/', row.decedentId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAgeFromDob(birthday: any) {
    const ageDifMs = Date.now() - birthday;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  private getMannerOfDeathList(decedentGridDtoList: DecedentGridDTO[]) {
    const result = [...new Set (decedentGridDtoList.map(decedent => decedent.mannerOfDeath))].filter(element => !!element);;
    return result;
  }

  applyMannerOfDeathFilter() {
    const mannerOfDeath = this.mannerOfDeathSelect.value;
    this.dataSource.filter = mannerOfDeath;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private setDataSourceFilters() {
    this.pipe = new DatePipe('en');
    const defaultPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data, filter) => {
      const formatted = this.pipe.transform(data.tod,'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data,filter) ;
    }
  }

  onClearFilters() {
    this.mannerOfDeathSelect.value = null;
    this.input.nativeElement.value = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

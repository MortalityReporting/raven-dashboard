import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from '@angular/material/paginator';
import {MatSort} from "@angular/material/sort";
import {DecedentGridDTO} from "../../../model/decedent.grid.dto";
import {DecedentService} from "../../../service/decedent.service";
import {ActivatedRoute} from "@angular/router";
import {mergeMap, forkJoin, map} from "rxjs";

interface ngOnDestroy {
}

@Component({
  selector: 'app-case-explorer',
  templateUrl: './case-explorer.component.html',
  styleUrls: ['./case-explorer.component.css']
})
export class CaseExplorerComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['index', 'firstName', 'lastName', 'gender',  'tod', 'system'];
  decedentGridDtoList: DecedentGridDTO[];
  isLoading = true;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    // private constants: Constants,
  ) {
  }

  mapToDto(entry: any): DecedentGridDTO {
    let decedentDTO = new DecedentGridDTO();
    decedentDTO.decedentId = entry.resource?.id;
    decedentDTO.firstName = entry.resource?.name[0]?.given[0];
    decedentDTO.lastName = entry.resource?.name[0]?.family;
    decedentDTO.gender = entry.resource?.gender;
    decedentDTO.system = entry.resource?.identifier[0]?.system;
    decedentDTO.age = this.getAgeFromDob(new Date(entry.resource?.birthDate));
    return decedentDTO;
  }

  ngOnInit(): void {

    this.isLoading = true;

    this.decedentService.getDecedentRecords().pipe(
      mergeMap((clinicalCaseList: any[]) =>
        forkJoin(
          clinicalCaseList.map((clinicalCase: any, i) =>
            this.decedentService.getDetails(clinicalCase).pipe(
              map((observation: any) => {
                clinicalCase = this.mapToDto(clinicalCase);
                clinicalCase.tod = observation?.entry[0]?.resource?.effectiveDateTime;
                clinicalCase.index = i + 1;
                return clinicalCase;
              })
            )
          ))
      )
    ).subscribe({
        next: (data) => {
          this.decedentGridDtoList = data;
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          },
        error: (e) => {
          console.error(e);
          //TODO render error message to the user
        },
        complete:  () => {
          this.isLoading = false
          }
    });
  }

  onRowClicked(row: any) {
    console.log(row);
  }

  pageChanged(event: PageEvent) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAgeFromDob(birthday: any) {
    const ageDifMs = Date.now() - birthday;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}

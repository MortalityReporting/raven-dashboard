import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from '@angular/material/paginator';
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
export class CaseExplorerComponent implements OnInit, AfterViewInit, ngOnDestroy {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['firstName', 'lastName', 'gender',  'tod', 'system'];
  totalCount: 0;
  decedentGridDtoList: DecedentGridDTO[];
  isLoading = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    decedentDTO.firstName = entry.resource?.name[0].given[0];
    decedentDTO.lastName = entry.resource?.name[0].family;
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
          clinicalCaseList.map((clinicalCase: any) =>
            this.decedentService.getDetails(clinicalCase).pipe(
              map((tod: string) => {
                clinicalCase = this.mapToDto(clinicalCase);
                clinicalCase.tod = tod;
                return clinicalCase;
              })
            )
          ))
      )
    ).subscribe((data: any) => {
      this.isLoading = false;
      this.decedentGridDtoList = data;
      this.dataSource = new MatTableDataSource(data);
    },
      (response: any)=> {console.log(response)},
      () => { this.isLoading = false;}
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe(() => {
    });
  }

  ngOnDestroy() {
  }

  onRowClicked(row: any) {
    console.log(row);
  }

  pageChanged(event: PageEvent) {
  }

  getAgeFromDob(birthday: any) {
    const ageDifMs = Date.now() - birthday;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}

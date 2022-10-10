import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.css']
})
export class MappingsComponent implements OnInit, OnChanges {

  @Input() fhirBundle: any;
  displayedColumns: string[] = ['name', 'value', 'status'];
  dataSource = new MatTableDataSource<any>();
  selectedFilter: string = 'Show all';
  filters: string[] = ['Show all', 'Show Mapped', 'Show Unmapped'];
  mappedData: any[];
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['fhirBundle'].currentValue){
      const value = changes['fhirBundle'].currentValue;
      this.mappedData = Object.keys(value.fields).map(key => {return {
        name: key,
        status: value.fields[key].status,
        value: value.fields[key].value,
        FHIRResource: value.fields[key].FHIRResource,
      }})
        .sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
        .sort((a,b) => (a.status.toLowerCase() > b.status.toLowerCase() ? -1 : 1));
      this.dataSource.data = this.mappedData;
    }
  }

  onFilterChanged(filter: string) {
    if(this.mappedData?.length > 0) {
      if (filter === this.filters[0]) {
        this.dataSource.data = this.mappedData;
      }
      else if (filter === this.filters[1]) {
        this.dataSource.data = this.mappedData.filter(element => element.status === "mapped");
      }
      else if (filter === this.filters[2]) {
        this.dataSource.data = this.mappedData.filter(value => value.status === "not mapped")
      }
    }
  }
}

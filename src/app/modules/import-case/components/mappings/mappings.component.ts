import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.scss']
})
export class MappingsComponent implements OnInit, OnChanges {

  @Input() fhirBundle: any;
  displayedColumns: string[] = ['name', 'value', 'status'];
  dataSource = new MatTableDataSource<any>();
  selectedFilter: string = 'Show Mapped';
  filters: string[] = ['Show Mapped', 'Show Not Mapped', 'Show All'];
  mappedData: any[];
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['fhirBundle'].currentValue){
      const value = changes['fhirBundle'].currentValue;
      //Create initial mapping. The response is object as opposed to an array of objects.
      this.mappedData = Object.keys(value.fields).map(key => {
        return {
          name: key,
          status: value.fields[key].status,
          value: value.fields[key],
        }
      })
        .map(element=> {
        if(element.value.length){
          const result  = element.value.map(inner => {
            return Object.keys(inner).map(el=> {
              const result = {
                name: element.name + '-' + el,
                value: inner[el].value,
                status: inner[el].status,
              }
              return result;
            });
          })
          return result
        }
        else {
          return {
            name: element.name,
            value: element.value.value,
            status: element.status,
          }
        }
      }).flat().flat()//we need to execute the flat operation twice, because the array is nested twice.
        .filter( el => !!el.status)
        .map( value =>
        {
          if(value.status?.toLowerCase() === 'unmapped'){
            value.status = 'Not Mapped';
            return value;
          }
          else {
            return value;
          }
        })
        .sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1))
        .sort((a,b) => (a.status.toLowerCase() > b.status.toLowerCase() ? 1 : -1))
        .filter(value => value.status !== 'success');

      this.dataSource.data = this.mappedData.filter(element => element.status === "mapped");
      this.selectedFilter = this.filters[0];

      // When the user selects a new case we want the table with the mappings to scroll to the top.
      const mappingsTable = document.getElementById('mappingsTable');
      if(mappingsTable) {
        mappingsTable.scrollTop = 0;
      }
    }
  }

  onFilterChanged(filter: string) {
    if(this.mappedData?.length > 0) {
      if (filter === this.filters[0]) {
        this.dataSource.data = this.mappedData.filter(element => element.status === "mapped");
      }
      else if (filter === this.filters[1]) {
        this.dataSource.data = this.mappedData.filter(value => value.status === "not mapped")
      }
      else if (filter === this.filters[2]) {
        this.dataSource.data = this.mappedData;
      }
    }
    //When the user selects new filter, we want to scroll the table back to the top
    const mappingsTable = document.getElementById('mappingsTable');
    mappingsTable.scrollTop = 0;
  }
}

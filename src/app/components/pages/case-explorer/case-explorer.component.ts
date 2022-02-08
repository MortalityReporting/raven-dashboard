import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from "@angular/material/sort";
import {Decedent} from "../../../model/decedent";

@Component({
  selector: 'app-case-explorer',
  templateUrl: './case-explorer.component.html',
  styleUrls: ['./case-explorer.component.css']
})
export class CaseExplorerComponent implements OnInit {

  constructor() { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['decedentId', 'firstName', 'lastName', 'gender', 'age'];
  dataSource = new MatTableDataSource<Decedent>(DECEDENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
  }

}

const DECEDENT_DATA: Decedent[] = [
  {decedentId: 1, firstName: 'George', lastName: 'Burdell', gender: 'M', age: 34},
  {decedentId: 2, firstName: 'Saima', lastName: 'Riley', gender: 'F', age: 51},
  {decedentId: 3, firstName: 'Lochlan', lastName: 'Carney', gender: 'M', age: 54},
  {decedentId: 4, firstName: 'Aneesah', lastName: 'Pratt', gender: 'F', age: 46},
  {decedentId: 5, firstName: 'Ellen', lastName: 'Collins', gender: 'F', age: 65},
  {decedentId: 6, firstName: 'Shannan', lastName: 'Whittington', gender: 'F', age: 57},
  {decedentId: 7, firstName: 'Mariyam', lastName: 'Goulding', gender: 'M', age: 63},
  {decedentId: 8, firstName: 'Antoine', lastName: 'Kumar', gender: 'M', age: 52},
  {decedentId: 9, firstName: 'Kanye', lastName: 'Parkinson', gender: 'M', age: 39},
  {decedentId: 10, firstName: 'Jonah', lastName: 'Franks', gender: 'M', age: 45},
  {decedentId: 11, firstName: 'Jimi', lastName: 'Underwood', gender: 'M', age: 47},
  {decedentId: 12, firstName: 'Luther', lastName: 'Stephens', gender: 'M', age: 51},
  {decedentId: 13, firstName: 'Tyra', lastName: 'Combs', gender: 'M', age: 34},
  {decedentId: 14, firstName: 'Clifford', lastName: 'Buck', gender: 'M', age: 57},
  {decedentId: 15, firstName: 'Aliza', lastName: 'Schmidt', gender: 'F', age: 64},
  {decedentId: 16, firstName: 'Izzie', lastName: 'Melia', gender: 'F', age: 56},
  {decedentId: 17, firstName: 'Kuba', lastName: 'Goldsmith', gender: 'M', age: 79},
  {decedentId: 18, firstName: 'Nala', lastName: 'Simons', gender: 'F', age: 61},
  {decedentId: 19, firstName: 'Lila', lastName: 'Piper', gender: 'F', age: 64},
  {decedentId: 20, firstName: 'Edward', lastName: 'Rollins', gender: 'M', age: 52},
  {decedentId: 21, firstName: 'Hajrah', lastName: 'Lister', gender: 'F', age: 59},
  {decedentId: 22, firstName: 'Clara', lastName: 'Wall', gender: 'M', age: 61},
  {decedentId: 23, firstName: 'Katy', lastName: 'Levy', gender: 'F', age: 49},
  {decedentId: 24, firstName: 'George', lastName: 'Rowley', gender: 'M', age: 53},
  {decedentId: 25, firstName: 'Elyas', lastName: 'Pitt', gender: 'M', age: 43},
  {decedentId: 26, firstName: 'Katey', lastName: 'Zuniga', gender: 'F', age: 51},
  {decedentId: 27, firstName: 'Ernest', lastName: 'Bailey', gender: 'M', age: 40},
  {decedentId: 28, firstName: 'Janine', lastName: 'Rooney', gender: 'F', age: 50},
  {decedentId: 29, firstName: 'Kingsley', lastName: 'Daugherty', gender: 'M', age: 39},
  {decedentId: 30, firstName: 'Matthias', lastName: 'Greene', gender: 'M', age: 61},
  {decedentId: 31, firstName: 'Johnathon', lastName: 'Smith', gender: 'M', age: 52},

];

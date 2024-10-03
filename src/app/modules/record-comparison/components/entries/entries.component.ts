import { Component } from '@angular/core';
import {ComparisonParserService} from "../../services/comparison-parser.service";
import {ComparisonResult} from "../../models_new/comparison-result";
import {ComparisonEntity} from "../../models_new/comparison-model";

@Component({
  selector: 'rc-entries',
  templateUrl: './entries.component.html',
  styleUrl: './entries.component.scss'
})
export class EntriesComponent {

  comparisonResult: ComparisonResult = undefined;
  constructor(public comparisonParserService: ComparisonParserService) {
    comparisonParserService.getComparisonResult().subscribe({
      next: value => {
        this.comparisonResult = value;
        console.log(this.comparisonResult);
      }
    })

  }

  protected readonly ComparisonEntity = ComparisonEntity;
}

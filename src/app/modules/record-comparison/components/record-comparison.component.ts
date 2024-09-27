import {Component, Inject, OnInit} from '@angular/core';
import {ModuleHeaderConfig} from "../../../providers/module-header-config";
import {ReferenceDocumentService} from "../services/reference-document.service";
import {MdiToEDRSDocumentWrapper} from "../models/mdiToEdrsDocumentWrapper";
import {ActivatedRoute} from "@angular/router";
import {UserDocumentService} from "../services/user-document.service";

@Component({
  selector: 'rc-record-comparison',
  templateUrl: './record-comparison.component.html',
  styleUrl: './record-comparison.component.scss'
})
export class RecordComparisonComponent implements OnInit{

  setRecordExpanded = true;
  userDocumentWrapper: MdiToEDRSDocumentWrapper; // A
  referenceDocumentWrapper: MdiToEDRSDocumentWrapper; // B

  constructor(
    @Inject('comparisonConfig') public config: ModuleHeaderConfig,
    private referenceDocumentService: ReferenceDocumentService,
    private userDocumentService: UserDocumentService,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    this.getUserDocumentWrapper();
    this.getReferenceDocumentWrappers();


  }

  private getUserDocumentWrapper() {
    let compositionId = this.route.snapshot.params['id'];
    if (compositionId) {
      this.userDocumentService.getUserDocumentBundle(compositionId).subscribe(
        {
          next: (userDocumentWrapper: MdiToEDRSDocumentWrapper) => {
            this.userDocumentWrapper = userDocumentWrapper;
            console.log(this.userDocumentWrapper);
          },
          error: err => {
            console.error(err)
          }
        },
      );
    }
  }

  private getReferenceDocumentWrappers() {
    this.referenceDocumentService.getReferenceDocuments().subscribe(
      {
        next: value => {
          console.log("On value loaded")
          console.log(value);
        },
        error: err => {
          console.error(err);
        }
      }
    );
  }
}

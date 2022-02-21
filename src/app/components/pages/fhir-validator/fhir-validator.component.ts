import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup, NgForm,
  Validators
} from "@angular/forms";
import {ValidateFhir} from "../../../validator/validate-fhir";
import {UtilsService} from "../../../service/utils.service";

@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.css']
})
export class FhirValidatorComponent implements OnInit {

  form: FormGroup;
  @ViewChild('formDirective') formDirective: NgForm;

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService
  ) {}

  createForm(){
    this.form = this.formBuilder.group({
      fhirResource: new FormControl(null, [Validators.required, ValidateFhir],null),
      textFormat: new FormControl("json", [Validators.required],null),
    },
      //{ updateOn: 'submit'}
    );
  }

  submit() {
    if(this.form.valid) {
     // this.formDirective.resetForm();
    }
    const result = this.utilsService.isXmlString(this.form.controls['fhirResource'].value.trim());
    console.log(result)
  }

  onClear() {
    // We need to reset the form directive and not the form.
    // We also need to use set timeout, or required values will render mat-error messages
    setTimeout(() => this.formDirective.resetForm(), 0)
  }

  getErrorMessage(form: AbstractControl) {
    console.log("I am running");
  }

  ngOnInit() {
    this.createForm();
  }

  onPaste(event: ClipboardEvent) {
    let fhirInputStr = event.clipboardData.getData('text');
    if(fhirInputStr && fhirInputStr.length){
      this.determineDataType(fhirInputStr.trim());
    }
  }

  private determineDataType(fhirInputStr: string) {
    if(this.utilsService.isJsonString(fhirInputStr)){
      this.form.controls['textFormat'].setValue('json');
    }
    else if(this.utilsService.isXmlString(fhirInputStr)){
      this.form.controls['textFormat'].setValue('xml');
    }
  }

  onFormatInput() {
    if(this.form.controls['textFormat'].value == 'json'){
      this.form.controls['fhirResource'].setValue(this.utilsService.beautifyJSON(this.form.controls['fhirResource'].value))
      // let strValue =  this.form.controls['fhirResource'].value;
      // const parsedJson = JSON.stringify(JSON.parse(strValue), null, 2);
      //
      // this.form.controls['fhirResource'].setValue(parsedJson);
    }

  }
}





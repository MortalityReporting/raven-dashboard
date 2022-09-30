import * as Diff from 'diff';
import {DiffValue} from './diff-value';

export class PatientDiff {
    resourceType: DiffValue;
    id: DiffValue;
    text: DiffValue;
    identifier: DiffValue;
    extension: DiffValue;
    name: DiffValue;
    gender: DiffValue;
    birthDate: DiffValue;
    address: DiffValue;

    constructor()
    {
        this.resourceType = new DiffValue();
        this.id = new DiffValue();
        this.text = new DiffValue();
        this.identifier = new DiffValue();
        this.extension = new DiffValue();
        this.name = new DiffValue();
        this.gender = new DiffValue();
        this.birthDate = new DiffValue();
        this.address = new DiffValue();
    }

    doDiff( actualPatient: any, expectedPatient: any )
    {    
        try {      
            this.resourceType.actual = JSON.stringify( actualPatient.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( expectedPatient.resourceType, null, 4 );
            this.resourceType.difference = DiffValue.doDiff( Diff.diffChars( this.resourceType.actual, this.resourceType.expected ));  

            this.id.actual = JSON.stringify( actualPatient.id, null, 4 );
            this.id.expected = JSON.stringify( expectedPatient.id, null, 4 );
            this.id.difference = DiffValue.doDiff( Diff.diffChars( this.id.actual, this.id.expected ));  

            this.text.actual = JSON.stringify( actualPatient.text, null, 4 );
            this.text.expected = JSON.stringify( expectedPatient.text, null, 4 );
            this.text.difference = DiffValue.doDiff( Diff.diffChars( this.text.actual, this.text.expected ));  

            this.identifier.actual = JSON.stringify( actualPatient.identifier, null, 4 );
            this.identifier.expected = JSON.stringify( expectedPatient.identifier, null, 4 );
            this.identifier.difference = DiffValue.doDiff( Diff.diffChars( this.identifier.actual, this.identifier.expected ));  

            this.extension.actual = JSON.stringify( actualPatient.extension, null, 4 );
            this.extension.expected = JSON.stringify( expectedPatient.extension, null, 4 );
            this.extension.difference = DiffValue.doDiff( Diff.diffChars( this.extension.actual, this.extension.expected ));  

            this.name.actual = JSON.stringify( actualPatient.name, null, 4 );
            this.name.expected = JSON.stringify( expectedPatient.name, null, 4 );
            this.name.difference = DiffValue.doDiff( Diff.diffChars( this.name.actual, this.name.expected ));  

            this.gender.actual = JSON.stringify( actualPatient.gender, null, 4 );
            this.gender.expected = JSON.stringify( expectedPatient.gender, null, 4 );
            this.gender.difference = DiffValue.doDiff( Diff.diffChars( this.gender.actual, this.gender.expected ));  

            this.birthDate.actual = JSON.stringify( actualPatient.birthDate, null, 4 );
            this.birthDate.expected = JSON.stringify( expectedPatient.birthDate, null, 4 );
            this.birthDate.difference = DiffValue.doDiff( Diff.diffChars( this.birthDate.actual, this.birthDate.expected ));  

            this.address.actual = JSON.stringify( actualPatient.address, null, 4 );
            this.address.expected = JSON.stringify( expectedPatient.address, null, 4 );
            this.address.difference = DiffValue.doDiff( Diff.diffChars( this.address.actual, this.address.expected ));  
        } catch(e) {
            console.log(e);
        }
    }
}
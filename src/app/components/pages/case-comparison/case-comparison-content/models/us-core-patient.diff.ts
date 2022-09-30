import * as Diff from 'diff';
import {DiffValue} from '../diff-value';

export class USCorePatientDiff {    
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

    doDiff( actual: any, expected: any )
    {    
        try {      
            this.resourceType.actual = JSON.stringify( actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( expected.resourceType, null, 4 );
            [this.resourceType.state,this.resourceType.difference] = DiffValue.doDiff( Diff.diffChars( this.resourceType.actual, this.resourceType.expected ));  

            this.id.actual = JSON.stringify( actual.id, null, 4 );
            this.id.expected = JSON.stringify( expected.id, null, 4 );
            [this.id.state,this.id.difference] = DiffValue.doDiff( Diff.diffChars( this.id.actual, this.id.expected ));  

            this.text.actual = JSON.stringify( actual.text, null, 4 );
            this.text.expected = JSON.stringify( expected.text, null, 4 );
            [this.text.state,this.text.difference] = DiffValue.doDiff( Diff.diffChars( this.text.actual, this.text.expected ));  

            this.identifier.actual = JSON.stringify( actual.identifier, null, 4 );
            this.identifier.expected = JSON.stringify( expected.identifier, null, 4 );
            [this.identifier.state,this.identifier.difference] = DiffValue.doDiff( Diff.diffChars( this.identifier.actual, this.identifier.expected ));  

            this.extension.actual = JSON.stringify( actual.extension, null, 4 );
            this.extension.expected = JSON.stringify( expected.extension, null, 4 );
            [this.extension.state,this.extension.difference] = DiffValue.doDiff( Diff.diffChars( this.extension.actual, this.extension.expected ));  

            this.name.actual = JSON.stringify( actual.name, null, 4 );
            this.name.expected = JSON.stringify( expected.name, null, 4 );
            [this.name.state,this.name.difference] = DiffValue.doDiff( Diff.diffChars( this.name.actual, this.name.expected ));  

            this.gender.actual = JSON.stringify( actual.gender, null, 4 );
            this.gender.expected = JSON.stringify( expected.gender, null, 4 );
            [this.gender.state,this.gender.difference] = DiffValue.doDiff( Diff.diffChars( this.gender.actual, this.gender.expected ));  

            this.birthDate.actual = JSON.stringify( actual.birthDate, null, 4 );
            this.birthDate.expected = JSON.stringify( expected.birthDate, null, 4 );
            [this.birthDate.state,this.birthDate.difference] = DiffValue.doDiff( Diff.diffChars( this.birthDate.actual, this.birthDate.expected ));  

            this.address.actual = JSON.stringify( actual.address, null, 4 );
            this.address.expected = JSON.stringify( expected.address, null, 4 );
            [this.address.state,this.address.difference] = DiffValue.doDiff( Diff.diffChars( this.address.actual, this.address.expected ));  
        } catch(e) {
            console.log(e);
        }
    }
}
import * as Diff from 'diff';
import {DiffType} from '../diff-type';

export class USCorePatientDiff {    
    address: DiffType;
    birthDate: DiffType;
    extension: DiffType;
    gender: DiffType;
    id: DiffType;
    identifier: DiffType;
    meta: DiffType;
    name: DiffType;
    resourceType: DiffType;
    text: DiffType;

    style: string;

    actual: any;
    expected: any;

    constructor( actual: any, expected: any )
    {
        this.actual = actual;
        this.expected = expected;

        this.style = 'invalid';
        this.address = new DiffType();
        this.birthDate = new DiffType();
        this.extension = new DiffType();
        this.gender = new DiffType();
        this.id = new DiffType();
        this.identifier = new DiffType();
        this.meta = new DiffType();
        this.name = new DiffType();
        this.resourceType = new DiffType();
        this.text = new DiffType();

        this.doDiff();
    }

    doDiff()
    {    
        try {      
            this.address.actual = JSON.stringify( this.actual.address, null, 4 );
            this.address.expected = JSON.stringify( this.expected.address, null, 4 );
            [this.address.style,this.address.difference] = DiffType.doDiff( Diff.diffChars( this.address.expected, this.address.actual ));  

            this.birthDate.actual = JSON.stringify( this.actual.birthDate, null, 4 );
            this.birthDate.expected = JSON.stringify( this.expected.birthDate, null, 4 );
            [this.birthDate.style,this.birthDate.difference] = DiffType.doDiff( Diff.diffChars( this.birthDate.expected, this.birthDate.actual ));  

            this.extension.actual = JSON.stringify( this.actual.extension, null, 4 );
            this.extension.expected = JSON.stringify( this.expected.extension, null, 4 );
            [this.extension.style,this.extension.difference] = DiffType.doDiff( Diff.diffChars( this.extension.expected, this.extension.actual ));  

            this.gender.actual = JSON.stringify( this.actual.gender, null, 4 );
            this.gender.expected = JSON.stringify( this.expected.gender, null, 4 );
            [this.gender.style,this.gender.difference] = DiffType.doDiff( Diff.diffChars( this.gender.expected, this.gender.actual ));  

            this.id.actual = JSON.stringify( this.actual.id, null, 4 );
            this.id.expected = JSON.stringify( this.expected.id, null, 4 );
            [this.id.style,this.id.difference] = DiffType.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));  

            this.identifier.actual = JSON.stringify( this.actual.identifier, null, 4 );
            this.identifier.expected = JSON.stringify( this.expected.identifier, null, 4 );
            [this.identifier.style,this.identifier.difference] = DiffType.doDiff( Diff.diffChars( this.identifier.expected, this.identifier.actual ));  

            this.meta.actual = JSON.stringify( this.actual.meta, null, 4 );
            this.meta.expected = JSON.stringify( this.expected.meta, null, 4 );
            [this.meta.style,this.meta.difference] = DiffType.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));  

            this.name.actual = JSON.stringify( this.actual.name, null, 4 );
            this.name.expected = JSON.stringify( this.expected.name, null, 4 );
            [this.name.style,this.name.difference] = DiffType.doDiff( Diff.diffChars( this.name.expected, this.name.actual ));  

            this.resourceType.actual = JSON.stringify( this.actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( this.expected.resourceType, null, 4 );
            [this.resourceType.style,this.resourceType.difference] = DiffType.doDiff( Diff.diffChars( this.resourceType.expected, this.resourceType.actual ));  

            this.text.actual = JSON.stringify( this.actual.text, null, 4 );
            this.text.expected = JSON.stringify( this.expected.text, null, 4 );
            [this.text.style,this.text.difference] = DiffType.doDiff( Diff.diffChars( this.text.expected, this.text.actual ));  

            let style = 
                this.address.style === 'valid' &&
                this.birthDate.style === 'valid' &&
                this.extension.style === 'valid' &&
                this.id.style === 'valid' &&
                this.identifier.style === 'valid' &&
                this.gender.style === 'valid' &&
                this.meta.style === 'valid' &&
                this.name.style === 'valid' &&
                this.resourceType.style === 'valid' &&
                this.text.style === 'valid'
        
            this.style = style ? 'valid' : 'invalid';

        } catch(e) {
            console.log(e);
        }
    }
}
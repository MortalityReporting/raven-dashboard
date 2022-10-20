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
            this.address.expected = JSON.stringify( this.expected.address, null, 4 );
            this.address.actual = JSON.stringify( this.actual.address, null, 4 );
            [this.address.style,this.address.difference] = DiffType.doDiff( Diff.diffChars( this.address.expected, this.address.actual ));  
        } catch(e) {};

        try {
            this.birthDate.expected = JSON.stringify( this.expected.birthDate, null, 4 );
            this.birthDate.actual = JSON.stringify( this.actual.birthDate, null, 4 );
            [this.birthDate.style,this.birthDate.difference] = DiffType.doDiff( Diff.diffChars( this.birthDate.expected, this.birthDate.actual ));  
        } catch(e) {};

        try {
            this.extension.expected = JSON.stringify( this.expected.extension, null, 4 );
            this.extension.actual = JSON.stringify( this.actual.extension, null, 4 );
            [this.extension.style,this.extension.difference] = DiffType.doDiff( Diff.diffChars( this.extension.expected, this.extension.actual ));  
        } catch(e) {};

        try {
            this.gender.expected = JSON.stringify( this.expected.gender, null, 4 );
            this.gender.actual = JSON.stringify( this.actual.gender, null, 4 );
            [this.gender.style,this.gender.difference] = DiffType.doDiff( Diff.diffChars( this.gender.expected, this.gender.actual ));  
        } catch(e) {};

        try {
            this.id.expected = JSON.stringify( this.expected.id, null, 4 );
            this.id.actual = JSON.stringify( this.actual.id, null, 4 );
            [this.id.style,this.id.difference] = DiffType.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));  
        } catch(e) {};

        try {
            this.identifier.expected = JSON.stringify( this.expected.identifier, null, 4 );
            this.identifier.actual = JSON.stringify( this.actual.identifier, null, 4 );
            [this.identifier.style,this.identifier.difference] = DiffType.doDiff( Diff.diffChars( this.identifier.expected, this.identifier.actual ));  
        } catch(e) {};

        try {
            this.meta.expected = JSON.stringify( this.expected.meta, null, 4 );
            this.meta.actual = JSON.stringify( this.actual.meta, null, 4 );
            [this.meta.style,this.meta.difference] = DiffType.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));  
        } catch(e) {};

        try {
            this.name.expected = JSON.stringify( this.expected.name, null, 4 );
            this.name.actual = JSON.stringify( this.actual.name, null, 4 );
            [this.name.style,this.name.difference] = DiffType.doDiff( Diff.diffChars( this.name.expected, this.name.actual ));  
        } catch(e) {};

        try {
            this.resourceType.expected = JSON.stringify( this.expected.resourceType, null, 4 );
            this.resourceType.actual = JSON.stringify( this.actual.resourceType, null, 4 );
            [this.resourceType.style,this.resourceType.difference] = DiffType.doDiff( Diff.diffChars( this.resourceType.expected, this.resourceType.actual ));  
        } catch(e) {};

        try {
            this.text.expected = JSON.stringify( this.expected.text, null, 4 );
            this.text.actual = JSON.stringify( this.actual.text, null, 4 );
            [this.text.style,this.text.difference] = DiffType.doDiff( Diff.diffChars( this.text.expected, this.text.actual ));  
        } catch(e) {};
    }
}
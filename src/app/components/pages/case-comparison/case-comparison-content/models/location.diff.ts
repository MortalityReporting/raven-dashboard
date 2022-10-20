import * as Diff from 'diff';
import {DiffType} from '../diff-type';

export class LocationDiff {    
    address: DiffType;
    id: DiffType;
    meta: DiffType;
    name: DiffType;
    resourceType: DiffType;
    type: DiffType;

    style: string;

    actual: any;
    expected: any;

    constructor( actual: any, expected: any )
    {
        this.actual = actual;
        this.expected = expected;

        this.style = 'invalid';
        this.address = new DiffType();
        this.id = new DiffType();
        this.meta = new DiffType();
        this.name = new DiffType();
        this.resourceType = new DiffType();
        this.type = new DiffType();
    }

    doDiff()
    {    
        try {      
            this.address.actual = JSON.stringify( this.actual.address, null, 4 );
            this.address.expected = JSON.stringify( this.expected.address, null, 4 );
            [this.address.style,this.address.difference] = DiffType.doDiff( Diff.diffChars( this.address.expected, this.address.actual ));  
        } catch(e) {};

        try {
            this.id.actual = JSON.stringify( this.actual.id, null, 4 );
            this.id.expected = JSON.stringify( this.expected.id, null, 4 );
            [this.id.style,this.id.difference] = DiffType.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));  
        } catch(e) {};

        try {
            this.meta.actual = JSON.stringify( this.actual.meta, null, 4 );
            this.meta.expected = JSON.stringify( this.expected.meta, null, 4 );
            [this.meta.style,this.meta.difference] = DiffType.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));  
        } catch(e) {};

        try {
            this.name.actual = JSON.stringify( this.actual.name, null, 4 );
            this.name.expected = JSON.stringify( this.expected.name, null, 4 );
            [this.name.style,this.name.difference] = DiffType.doDiff( Diff.diffChars( this.name.expected, this.name.actual ));  
        } catch(e) {};

        try {
            this.resourceType.actual = JSON.stringify( this.actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( this.expected.resourceType, null, 4 );
            [this.resourceType.style,this.resourceType.difference] = DiffType.doDiff( Diff.diffChars( this.resourceType.expected, this.resourceType.actual ));  
        } catch(e) {};

        try {
            this.type.actual = JSON.stringify( this.actual.type, null, 4 );
            this.type.expected = JSON.stringify( this.expected.type, null, 4 );
            [this.type.style,this.type.difference] = DiffType.doDiff( Diff.diffChars( this.type.expected, this.type.actual ));  
        } catch(e) {};
    }
}
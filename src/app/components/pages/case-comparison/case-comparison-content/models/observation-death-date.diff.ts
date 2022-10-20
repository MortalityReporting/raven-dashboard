import * as Diff from 'diff';
import {DiffType} from '../diff-type';
import {ObservationDiff} from './observation.diff';

export class ObservationDeathDateDiff extends ObservationDiff { 
    effectiveDateTime: DiffType;
    establishmentApproach: DiffType;
    method: DiffType;
    pronouncedDateTime: DiffType;
    status: DiffType;
    valueDateTime: DiffType;
    
    constructor( actual: any, expected: any )
    {
        super( actual, expected );

        this.effectiveDateTime = new DiffType();
        this.establishmentApproach = new DiffType();
        this.method = new DiffType();
        this.pronouncedDateTime = new DiffType();
        this.status = new DiffType();
        this.valueDateTime = new DiffType();

        this.doDiff();
    }

    override doDiff()
    {    
        super.doDiff();

        try {  
            this.pronouncedDateTime.expected = JSON.stringify( this.expected.component[0], null, 4 );
            this.pronouncedDateTime.actual = JSON.stringify( this.actual.component[0], null, 4 );
            [this.pronouncedDateTime.style,this.pronouncedDateTime.difference] = DiffType.doDiff( Diff.diffChars( this.pronouncedDateTime.expected, this.pronouncedDateTime.actual ));  
        } catch(e) {};

        try {  
            this.establishmentApproach.expected = JSON.stringify( this.expected.component[1], null, 4 );
            this.establishmentApproach.actual = JSON.stringify( this.actual.component[1], null, 4 );
            [this.establishmentApproach.style,this.establishmentApproach.difference] = DiffType.doDiff( Diff.diffChars( this.establishmentApproach.expected, this.establishmentApproach.actual ));  
        } catch(e) {};

        try {  
            this.method.expected = JSON.stringify( this.expected.method, null, 4 );
            this.method.actual = JSON.stringify( this.actual.method, null, 4 );
            [this.method.style,this.method.difference] = DiffType.doDiff( Diff.diffChars( this.method.expected, this.method.actual ));  
        } catch(e) {};

        try {  
            this.status.expected = JSON.stringify( this.expected.status, null, 4 );
            this.status.actual = JSON.stringify( this.actual.status, null, 4 );
            [this.status.style,this.status.difference] = DiffType.doDiff( Diff.diffChars( this.status.expected, this.status.actual ));  
        } catch(e) {};

        try {
            this.effectiveDateTime.expected = JSON.stringify( this.expected.effectiveDateTime, null, 4 );
            this.effectiveDateTime.actual = JSON.stringify( this.actual.effectiveDateTime, null, 4 );
            [this.effectiveDateTime.style,this.effectiveDateTime.difference] = DiffType.doDiff( Diff.diffChars( this.effectiveDateTime.expected, this.effectiveDateTime.actual ));  
        } catch(e) {};

        try {
            this.valueDateTime.expected = JSON.stringify( this.expected.valueDateTime, null, 4 );
            this.valueDateTime.actual = JSON.stringify( this.actual.valueDateTime, null, 4 );
            [this.valueDateTime.style,this.valueDateTime.difference] = DiffType.doDiff( Diff.diffChars( this.valueDateTime.expected, this.valueDateTime.actual ));  
        } catch(e) {};
    }
}
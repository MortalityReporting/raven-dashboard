import * as Diff from 'diff';
import {DiffType} from '../diff-type';
import {ObservationDiff} from './observation.diff';

export class ObservationDeathDateDiff extends ObservationDiff { 
    effectiveDateTime: DiffType;
    status: DiffType;
    valueDateTime: DiffType;
    
    constructor( actual: any, expected: any )
    {
        super( actual, expected );

        this.status = new DiffType();
        this.effectiveDateTime = new DiffType();
        this.valueDateTime = new DiffType();

        this.doDiff();
    }

    override doDiff()
    {    
        super.doDiff();

        try {  
            this.status.actual = JSON.stringify( this.actual.status, null, 4 );
            this.status.expected = JSON.stringify( this.expected.status, null, 4 );
            [this.status.style,this.status.difference] = DiffType.doDiff( Diff.diffChars( this.status.expected, this.status.actual ));  

            this.effectiveDateTime.actual = JSON.stringify( this.actual.effectiveDateTime, null, 4 );
            this.effectiveDateTime.expected = JSON.stringify( this.expected.effectiveDateTime, null, 4 );
            [this.effectiveDateTime.style,this.effectiveDateTime.difference] = DiffType.doDiff( Diff.diffChars( this.effectiveDateTime.expected, this.effectiveDateTime.actual ));  

            this.valueDateTime.actual = JSON.stringify( this.actual.valueDateTime, null, 4 );
            this.valueDateTime.expected = JSON.stringify( this.expected.valueDateTime, null, 4 );
            [this.valueDateTime.style,this.valueDateTime.difference] = DiffType.doDiff( Diff.diffChars( this.valueDateTime.expected, this.valueDateTime.actual ));  

            let style =
                this.style === 'valid' &&
                this.effectiveDateTime.style === 'valid' &&
                this.status.style === 'valid' &&
                this.valueDateTime.style === 'valid'

            this.style = style ? 'valid' : 'invalid';
        } catch(e) {
            console.log(e);
        }
    }
}
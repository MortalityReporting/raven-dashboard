import * as Diff from 'diff';
import {DiffValue} from '../diff-value';
import {ObservationDiff} from './observation.diff';

export class ObservationDeathDateDiff extends ObservationDiff { 
    effectiveDateTime: DiffValue;
    status: DiffValue;
    valueDateTime: DiffValue;

    constructor()
    {
        super();

        this.status = new DiffValue();
        this.effectiveDateTime = new DiffValue();
        this.valueDateTime = new DiffValue();
    }

    override doDiff( actual: any, expected: any )
    {    
        super.doDiff( actual, expected );

        try {  
            this.status.actual = JSON.stringify( actual.status, null, 4 );
            this.status.expected = JSON.stringify( expected.status, null, 4 );
            [this.status.state,this.status.difference] = DiffValue.doDiff( Diff.diffChars( this.status.actual, this.status.expected ));  

            this.effectiveDateTime.actual = JSON.stringify( actual.effectiveDateTime, null, 4 );
            this.effectiveDateTime.expected = JSON.stringify( expected.effectiveDateTime, null, 4 );
            [this.effectiveDateTime.state,this.effectiveDateTime.difference] = DiffValue.doDiff( Diff.diffChars( this.effectiveDateTime.actual, this.effectiveDateTime.expected ));  

            this.valueDateTime.actual = JSON.stringify( actual.valueDateTime, null, 4 );
            this.valueDateTime.expected = JSON.stringify( expected.valueDateTime, null, 4 );
            [this.valueDateTime.state,this.valueDateTime.difference] = DiffValue.doDiff( Diff.diffChars( this.valueDateTime.actual, this.valueDateTime.expected ));  
        } catch(e) {
            console.log(e);
        }
    }
}
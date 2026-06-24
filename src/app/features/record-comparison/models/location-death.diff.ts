import * as Diff from 'diff';
import {DiffType} from './diff-type';
import {LocationDiff} from './location.diff';

export class LocationDeathDiff extends LocationDiff {
    status: DiffType;
    identifier: DiffType;

    constructor( actual: any, expected: any )
    {
        super( actual, expected );

        this.style = 'invalid';
        this.status = new DiffType();
        this.identifier = new DiffType();

        this.doDiff();
    }

    override doDiff()
    {
        super.doDiff();

        try {
            this.status.expected = JSON.stringify( this.expected.status, null, 4 );
            this.status.actual = JSON.stringify( this.actual.status, null, 4 );
            [this.status.style,this.status.difference] = DiffType.doDiff( Diff.diffChars( this.status.expected, this.status.actual ));
        } catch(e) {}

        try {
            let style =
                this.style === 'valid' &&
                this.status.style === 'valid' &&
                this.identifier.style === 'valid'
        } catch(e) {}
    }
}

import * as Diff from 'diff';
import {DiffType} from './diff-type';
import {LocationDiff} from './location.diff';

export class LocationInjuryDiff extends LocationDiff {

    constructor( actual: any, expected: any )
    {
        super( actual, expected );

        this.style = 'invalid';

        this.doDiff();
    }

    override doDiff()
    {
        super.doDiff();
   }
}

import * as Diff from 'diff';
import {DiffType} from '../diff-type';
import {ObservationDiff} from './observation.diff';
import { DocumentHandlerService } from "../../../../../service/document-handler.service";

export class ObservationCauseOfDeathPart1Diff extends ObservationDiff {
    performer: DiffType;
    valueString: DiffType;
    valueCodeableConcept: DiffType;

    documentHandler: DocumentHandlerService

    constructor( 
        actual: any, 
        expected: any,
        documentHandler: DocumentHandlerService
        )
    {
        super( actual, expected );

        this.documentHandler = documentHandler;
        this.performer = new DiffType();
        this.valueString = new DiffType();
        this.valueCodeableConcept = new DiffType();

        this.doDiff();
    }

    override doDiff()
    {
        super.doDiff();
        
        console.log( this.expected );

        try {
            let expectedComponent = this.documentHandler.findObservationComponentByCode(this.expected, "69440-6");
            this.valueString.expected = JSON.stringify( expectedComponent.valueString, null, 4 );
            console.log( expectedComponent );
            let actualComponent = this.documentHandler.findObservationComponentByCode(this.actual, "69440-6");
            this.valueString.actual = JSON.stringify( actualComponent.valueString, null, 4 );
            [this.valueString.style,this.valueString.difference] = DiffType.doDiff( Diff.diffChars( this.valueString.expected, this.valueString.actual ));
        } catch(e) {};

        try {
            this.performer.expected = JSON.stringify( this.expected.performer, null, 4 );
            this.performer.actual = JSON.stringify( this.actual.performer, null, 4 );
            [this.performer.style,this.performer.difference] = DiffType.doDiff( Diff.diffChars( this.performer.expected, this.performer.actual ));
        } catch(e) {};

        try {
            this.valueCodeableConcept.expected = JSON.stringify( this.expected.valueCodeableConcept, null, 4 );
            this.valueCodeableConcept.actual = JSON.stringify( this.actual.valueCodeableConcept, null, 4 );
            [this.valueCodeableConcept.style,this.valueCodeableConcept.difference] = DiffType.doDiff( Diff.diffChars( this.valueCodeableConcept.expected, this.valueCodeableConcept.actual ));
        } catch(e) {};
    }
}

import * as Diff from 'diff';
import {DiffType} from '../diff-type';
import {ObservationDiff} from './observation.diff';
import { DocumentHandlerService } from "../../../../../service/document-handler.service";

export class ObservationDeathDateDiff extends ObservationDiff {
    effectiveDateTime: DiffType;
    method: DiffType;
    pronouncedDateTime: DiffType;
    status: DiffType;
    typeOfDeathLocation: DiffType;
    valueDateTime: DiffType;

    documentHandler: DocumentHandlerService

    constructor(
        actual: any,
        expected: any,
        documentHandler: DocumentHandlerService
        )
    {
        super( actual, expected );

        this.documentHandler = documentHandler;
        this.effectiveDateTime = new DiffType();
        this.method = new DiffType();
        this.pronouncedDateTime = new DiffType();
        this.status = new DiffType();
        this.typeOfDeathLocation = new DiffType();
        this.valueDateTime = new DiffType();

        this.doDiff();
    }

    override doDiff()
    {
        super.doDiff();

        try {
            let expectedComponent = this.documentHandler.findObservationComponentByCode(this.expected, "80616-6");
            this.pronouncedDateTime.expected = '"valueDateTime": "' + expectedComponent.valueDateTime + '"';

            let actualComponent = this.documentHandler.findObservationComponentByCode(this.actual, "80616-6");
            this.pronouncedDateTime.actual = '"valueDateTime": "' + actualComponent.valueDateTime + '"';

            [this.pronouncedDateTime.style,this.pronouncedDateTime.difference] = DiffType.doDiff( Diff.diffChars( this.pronouncedDateTime.expected, this.pronouncedDateTime.actual ));
        } catch(e) {};

        try {
            let expectedComponent = this.documentHandler.findObservationComponentByCode(this.expected, "58332-8");
            this.typeOfDeathLocation.expected = JSON.stringify( {valueCodeableConcept: expectedComponent.valueCodeableConcept}, null, 4 );

            let actualComponent = this.documentHandler.findObservationComponentByCode(this.actual, "58332-8");
            this.typeOfDeathLocation.actual = JSON.stringify( {valueCodeableConcept: actualComponent.valueCodeableConcept}, null, 4 );

            [this.typeOfDeathLocation.style,this.typeOfDeathLocation.difference] = DiffType.doDiff( Diff.diffChars( this.typeOfDeathLocation.expected, this.typeOfDeathLocation.actual ));
        } catch(e) {};

        try {
            this.method.expected = JSON.stringify( {method: this.expected.method}, null, 4 );
            this.method.actual = JSON.stringify( {method: this.actual.method}, null, 4 );
            [this.method.style,this.method.difference] = DiffType.doDiff( Diff.diffChars( this.method.expected, this.method.actual ));
        } catch(e) {};

        try {
            this.status.expected = JSON.stringify( {status: this.expected.status}, null, 4 );
            this.status.actual = JSON.stringify( this.actual.status, null, 4 );
            [this.status.style,this.status.difference] = DiffType.doDiff( Diff.diffChars( this.status.expected, this.status.actual ));
        } catch(e) {};

        try {
            this.effectiveDateTime.expected = '"effectiveDateTime": "' + this.expected.effectiveDateTime + '"';
            this.effectiveDateTime.actual = '"effectiveDateTime": "' + this.actual.effectiveDateTime + '"';
            [this.effectiveDateTime.style,this.effectiveDateTime.difference] = DiffType.doDiff( Diff.diffChars( this.effectiveDateTime.expected, this.effectiveDateTime.actual ));
        } catch(e) {};

        try {
            this.valueDateTime.expected = JSON.stringify( {valueDateTime: this.expected.valueDateTime}, null, 4 );
            this.valueDateTime.actual = JSON.stringify( {valueDateTime: this.actual.valueDateTime}, null, 4 );
            [this.valueDateTime.style,this.valueDateTime.difference] = DiffType.doDiff( Diff.diffChars( this.valueDateTime.expected, this.valueDateTime.actual ));
        } catch(e) {};
    }
}

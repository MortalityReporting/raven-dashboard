import * as Diff from 'diff';
import {DiffType} from '../diff-type';

export class CompositionMdiToEdrsDiff {    
    author: DiffType;
    date: DiffType;
    extension: DiffType;
    id: DiffType;
    identifier: DiffType;
    meta: DiffType;
    resourceType: DiffType;
    section: DiffType;
    status: DiffType;
    subject: DiffType;
    type: DiffType;

    state: string;

    constructor()
    {
        this.state = 'invalid';
        this.author = new DiffType();
        this.date = new DiffType();
        this.extension = new DiffType();
        this.id = new DiffType();
        this.identifier = new DiffType();
        this.meta = new DiffType();
        this.resourceType = new DiffType();
        this.section = new DiffType();
        this.status = new DiffType();
        this.subject = new DiffType();
        this.type = new DiffType();
    }

    doDiff( actual: any, expected: any )
    {    
        try {      
            this.author.actual = JSON.stringify( actual.author, null, 4 );
            this.author.expected = JSON.stringify( expected.author, null, 4 );
            [this.author.state,this.author.difference] = DiffType.doDiff( Diff.diffChars( this.author.expected, this.author.actual ));  

            this.date.actual = JSON.stringify( actual.date, null, 4 );
            this.date.expected = JSON.stringify( expected.date, null, 4 );
            [this.date.state,this.date.difference] = DiffType.doDiff( Diff.diffChars( this.date.expected, this.date.actual ));  

            this.extension.actual = JSON.stringify( actual.extension, null, 4 );
            this.extension.expected = JSON.stringify( expected.extension, null, 4 );
            [this.extension.state,this.extension.difference] = DiffType.doDiff( Diff.diffChars( this.extension.expected, this.extension.actual ));  

            this.id.actual = JSON.stringify( actual.id, null, 4 );
            this.id.expected = JSON.stringify( expected.id, null, 4 );
            [this.id.state,this.id.difference] = DiffType.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));  

            this.identifier.actual = JSON.stringify( actual.identifier, null, 4 );
            this.identifier.expected = JSON.stringify( expected.identifier, null, 4 );
            [this.identifier.state,this.identifier.difference] = DiffType.doDiff( Diff.diffChars( this.identifier.expected, this.identifier.actual ));  

            this.meta.actual = JSON.stringify( actual.meta, null, 4 );
            this.meta.expected = JSON.stringify( expected.meta, null, 4 );
            [this.meta.state,this.meta.difference] = DiffType.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));  

            this.resourceType.actual = JSON.stringify( actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( expected.resourceType, null, 4 );
            [this.resourceType.state,this.resourceType.difference] = DiffType.doDiff( Diff.diffChars( this.resourceType.actual, this.resourceType.expected ));  

            this.section.actual = JSON.stringify( actual.section, null, 4 );
            this.section.expected = JSON.stringify( expected.section, null, 4 );
            [this.section.state,this.section.difference] = DiffType.doDiff( Diff.diffChars( this.section.actual, this.section.expected ));  

            this.status.actual = JSON.stringify( actual.status, null, 4 );
            this.status.expected = JSON.stringify( expected.status, null, 4 );
            [this.status.state,this.status.difference] = DiffType.doDiff( Diff.diffChars( this.status.actual, this.status.expected ));  

            this.subject.actual = JSON.stringify( actual.subject, null, 4 );
            this.subject.expected = JSON.stringify( expected.subject, null, 4 );
            [this.subject.state,this.subject.difference] = DiffType.doDiff( Diff.diffChars( this.subject.actual, this.subject.expected ));  

            this.type.actual = JSON.stringify( actual.type, null, 4 );
            this.type.expected = JSON.stringify( expected.type, null, 4 );
            [this.type.state,this.type.difference] = DiffType.doDiff( Diff.diffChars( this.type.actual, this.type.expected ));  

            let state = 
                this.author.state === 'valid' &&
                this.date.state === 'valid' &&
                this.extension.state === 'valid' &&
                this.id.state === 'valid' &&
                this.identifier.state === 'valid' &&
                this.meta.state === 'valid' &&
                this.resourceType.state === 'valid' &&
                this.section.state === 'valid' &&
                this.status.state === 'valid' &&
                this.subject.state === 'valid' &&
                this.type.state=== 'valid';

            this.state = state ? 'valid' : 'invalid';
        
        } catch(e) {
            console.log(e);
        }
    }
}
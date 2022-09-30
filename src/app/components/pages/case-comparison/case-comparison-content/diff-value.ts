export class DiffValue
{
    state: string;
    actual: string;
    expected: string;
    difference: string;

    constructor()
    {
        this.state = "";
        this.actual = "";
        this.expected = "";
        this.difference = "";
    }  

    static doDiff( parts: any ): [string,string]
    {    
        var html = "<pre>";
        let state = 'valid';
  
        parts.map( part => {
            let span = "<span>";
  
            if (part.added != undefined && part.added == true)
            {
                state = 'invalid';
                span = '<span class="diff-added-color">';
            }
            else if (part.removed != undefined && part.removed == true)
            {
                state = 'invalid';
                span = '<span class="diff-removed-color">';
            }
  
            html += span + part.value + '</span>';
        });
  
        html += "</pre>";
  
        return [state,html];
    }
}


export class DiffValue
{
    actual: string;
    expected: string;
    difference: string;

    constructor()
    {
        this.actual = "";
        this.expected = "";
        this.difference = "";
    }  

    static doDiff( parts: any ): string
    {    
      var html = "<pre>";
  
      parts.map( part => {
        let span = "<span>";
  
        if (part.added != undefined && part.added == true)
        {
          span = '<span class="diff-added-color">';
        }
        else if (part.removed != undefined && part.removed == true)
        {
          span = '<span class="diff-removed-color">';
        }
  
        html += span + part.value + '</span>';
      });
  
      html += "</pre>";
  
      return html;
    }
  
}


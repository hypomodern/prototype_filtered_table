/* unobtrusive table filtering.
* by Matt Wilson (mhw@hypomodern.com), MIT Licensed
* big thanks as always to Dan Webb and his work on lowpro.
*/
var TableFilter = Behavior.create();
Object.extend(TableFilter.prototype, {
  initialize:function(striping_function, dynamic) {
    this.striper = striping_function;
    this.table = this.element.up("table");
    this.rows = $A($A(this.table.tBodies).first().rows);
    this.footer = this.table.tFoot ? $(this.table.tFoot) : false;
    this.dynamic = (typeof dynamic == "undefined") ? true : dynamic;
    this.index = this.element.up('th').cellIndex;
    
    //sinful! Browser sniffing! But I need to Element.extend the <tr> objects
    //and I'd rather do that here rather than at runtime in the methods.
    if(Prototype.Browser.IE) {
      this.rows.each(function(row) { Element.extend(row); });
    }
  },
  onclick:function(e) {
    Event.stop(e);
    this.element.select();
  },
  onkeyup:function(e) {
    if((e.keyCode != Event.KEY_RETURN) && !this.dynamic) { return true; }
    var value = this.element.value;
    if(value == "") {
      return this.unfilter();
    }
    
    var pattern = this.element.value;
    this.filter(pattern);
  },
  filter:function(regexp_string) {
    var re = new RegExp(regexp_string, 'i');
    var filtered_rows = this.rows.partition(function(row){
      var cell = row.cells[this.index];
      var cell_value = cell.textContent ? cell.textContent : cell.innerText;
      return re.test(cell_value);
    }.bind(this));
    filtered_rows[0].invoke('show'); //matching elements
    filtered_rows[1].invoke('hide'); //not-matched elements
    
    if(this.striper) { this.striper(this.table); }
    if(this.footer) { this.footer.hide(); }
  },
  unfilter:function() { //unfilter is broken out so we can just skip the regexp stuff.
    this.rows.invoke('show');
    if(this.striper) { this.striper(this.table); }
    if(this.footer) { this.footer.show(); }
  }
});
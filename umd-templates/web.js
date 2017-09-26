if (!this.<%= namespace %>) (function(doc, ev) {
  // define global object
  <%= namespace %> = (function(){
    <%= contents %>
  })();

  // dispatch load event
  ev = doc.createEvent('HTMLEvents');
  
  // the initEvent may be deprecated in the future, instead we can use the Event constructor
  ev.initEvent ? ev.initEvent('sentinel-load', false, false) : (ev = new Event('sentinel-load'));
  
  doc.dispatchEvent(ev);
})(document);
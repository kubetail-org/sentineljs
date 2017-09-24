if (!this.<%= namespace %>) (function(doc, ev) {
  // define global object
  <%= namespace %> = (function(){
    <%= contents %>
  })();

  // dispatch load event
  ev = doc.createEvent('HTMLEvents');
  ev.initEvent('sentinel-load', false, false);
  doc.dispatchEvent(ev);
})(document);

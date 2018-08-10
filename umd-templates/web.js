if (!this.<%= namespace %>) (function(doc, ev) {
  // define global object
  <%= namespace %> = (function(){
    <%= contents %>
  })();

  // dispatch load event
  ev = doc.createEvent('HTMLEvents');
  if (ev.initEvent) ev.initEvent('sentinel-load', false, false);
  else ev = new Event('sentinel-load');
  doc.dispatchEvent(ev);
})(document);

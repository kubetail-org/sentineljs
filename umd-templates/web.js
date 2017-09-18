// define global object
<%= namespace %> = (function (<%= param %>) {
// exit if library has already been loaded
if (document._sentinelJS) return;
document._sentinelJS = true;

<%= contents %>
})(<%= global %>);

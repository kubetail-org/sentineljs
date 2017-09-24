// define global object
<%= namespace %> = this.sentinel || (function (<%= param %>) {
<%= contents %>
})(<%= global %>);

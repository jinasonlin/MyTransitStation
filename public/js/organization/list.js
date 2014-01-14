$(document).ready(function() {
  $("#newBtn").click(function() {
    window.location.href = "/admin/organization/new";
  });

  $(".js-org .js-delBtn").click(function() {
    var id = $(this).parents(".js-org").data("orgId");
    $.post('/admin/organization/' + id, {_method: 'delete'}, function(result) {
      if (result.success) {
        window.location.href = "/admin/organization";
      } else {
        alert("delete failed");
      }
    });
  });
});
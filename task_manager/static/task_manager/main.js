$(document).on('click', '#todo', function() {
  if ($(this).is(':checked')) {
      var itemId = $(this).closest('li').attr('itemid');
      markItemAsCompleted(itemId);
  }
});

// Get the CSRF token from the cookie
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function markItemAsCompleted(itemId) {
  $.ajax({
    type: "PUT",
    url: "/mark_completed/",
    headers: {
        "X-CSRFToken": csrftoken
    },
    data: {
        item_id: itemId
    },
    success: function(response) {
        // Handle the successful response
        if (response.message === 'Item marked as completed.') {
          console.log("removed")
          $('#todo').slideUp('slow', function() {
              $(this).closest('li').remove();
          });
      }
    },
    error: function(xhr, errmsg, err) {
      console.log("an error has occurred")
        // Handle the error
    }
});

}

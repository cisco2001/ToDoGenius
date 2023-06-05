$(document).on('click', '.todo_checkbox', function() {
  if ($(this).is(':checked')) {
    var itemId = $(this).attr('id');
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
          $('#' + itemId).slideUp('slow', function() {
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
/* handle delete icon */
$(document).on('click', '.delete-item', function(e) {
  e.preventDefault();
  var itemId = $(this).data('itemid');
  deleteItem(itemId);
});
function deleteItem(itemId) {
  $.ajax({
    type: "DELETE",
    url: "/delete_task/",
    headers: {
      "X-CSRFToken": csrftoken
    },
    data: {
      item_id: itemId
    },
    success: function(response) {
      // Handle the successful response
      if (response.message === 'Item deleted.') {
        console.log("removed")
        $('#' + itemId).slideUp('slow', function() {
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

/* filter section */
$(document).ready(function() {
  $('#filter').change(function() {
    var selectedOption = $(this).val();
    filterTasks(selectedOption);
  });
});

function filterTasks(selectedOption) {
  if (selectedOption === 'pending') {
    $('#task-list .list-group-item.completed').hide();
    $('#task-list .list-group-item:not(.completed)').show();
  } else if (selectedOption === 'completed') {
    $('#task-list .list-group-item:not(.completed)').hide();
    $('#task-list .list-group-item.completed').show();
  }
}

/* show description section */
$(document).ready(function() {
  // Title click event
  $(document).on('click', '.title', function() {
    var taskItem = $(this).closest('.list-group-item');
    toggleDescription(taskItem);
  });
});

function toggleDescription(taskItem) {
  var descriptionElement = taskItem.find('.description');
  descriptionElement.slideToggle();
}

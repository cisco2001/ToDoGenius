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
    url: "/update_task/",
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
    $('#completed-message').hide();
    $('#task-list .list-group-item.completed').hide();
    $('#task-list .list-group-item:not(.completed)').show();
    if ($('#no-tasks-message').is(':hidden')) {
      $('#not-completed-message').show();
    }
    else {
      $('#not-completed-message').hide();
    }
    var visiblePendingTasksCount = $('#task-list .list-group-item:not(.completed)').length;
    if (visiblePendingTasksCount === 0) {
      message = `<div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-3 text-center mt-5">
          <h2 class="mb-4">Currently, there are no Pending tasks</h2>
        </div>
      </div>
    </div>`;
    document.getElementById('not-completed-message').innerHTML = message;
    }
  } else if (selectedOption === 'completed') {
    $('#not-completed-message').hide();
    $('#task-list .list-group-item:not(.completed)').hide();
    $('#task-list .list-group-item.completed').show();
    if ($('#no-tasks-message').is(':hidden')) {
      $('#completed-message').show();
    }
    else {
      $('#completed-message').hide()
    }
    var visibleCompletedTasksCount = $('#task-list .list-group-item.completed:visible').length;
    if (visibleCompletedTasksCount === 0) {
      message = `<div class="container">
      <div class="row">
        <div class="col-md-6 offset-md-3 text-center mt-5">
          <h2 class="mb-4">Currently, there are no Completed tasks.</h2>
        </div>
      </div>
    </div>`;
      document.getElementById('completed-message').innerHTML = message;
    }
  }
}

/* show description section */

/* edit section */
/*$(document).ready(function() {
  $('.clickable-icon').click(function(event) {
    event.preventDefault();
    var itemId = $(this).data('itemid');
    let titleId = document.getElementById("item_title" + itemId)
    let descriptionID = document.getElementById("item_description" + itemId)
    document.getElementById('edit-text').textContent = descriptionID.innerText;
    document.getElementById('edit-title').setAttribute('value', titleId.innerText);
    console.log(itemId)
    document.getElementById('edit-item-id').value = itemId;
    console.log(titleId.innerText, descriptionID.innerText);
  });
});
*/
/* calendar section */
$(document).ready(function() {
  $('#clickableCalendarIcon').click(function(e) {
    e.preventDefault(); // Prevent the default behavior of the anchor element
    $(this).hide(); // Hide the calendar icon
    $('#list_section').hide(); // Hide the list section
    $('#listIcon').show(); // Show the list icon
    $('#calendar_section').show(); // Show the calendar section
  });

  $('#listIcon').click(function(e) {
    e.preventDefault(); // Prevent the default behavior of the anchor element
    $(this).hide(); // Hide the list icon
    $('#clickableCalendarIcon').show(); // Show the calendar icon
    $('#calendar_section').hide(); // Hide the calendar section
    $('#list_section').show(); // Show the list section
  });
});

/*$(document).ready(function() {
  $('#clickableCalendarIcon').click(function(event) {
    event.preventDefault();
    loadIncludedTemplate();
  });
});

function loadIncludedTemplate() {
  $.ajax({
    url: '/calendar/',
    type: 'GET',
    success: function(response) {
      $('#templateContainer').html(response);
    },
    error: function(error) {
      console.error('Error loading included template:', error);
    }
  });
}*/

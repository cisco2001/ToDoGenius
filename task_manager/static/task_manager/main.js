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


/* edit section */
$(document).ready(function() {
  $('.clickable-icon').click(function(event) {
    event.preventDefault();
    var itemId = $(this).data('itemid');
    let titleId = document.getElementById("item_title")
    let descriptionID = document.getElementById("item_description")
    document.getElementById('modal_title').innerText = 'Edit task';
    document.getElementById('textarea4').setAttribute('value', descriptionID.innerText);
    document.getElementById('name4').setAttribute('value', titleId.innerText);
    console.log(titleId.innerText, descriptionID.innerText);
    showModal(itemId);
  });
});

function showModal(itemId) {
  $('#create_task').attr('action', '/mark_completed/' + itemId);
  $('#create_task').attr('method', 'PUT');
}

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

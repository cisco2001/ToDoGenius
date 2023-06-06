/* search section */
let searchBox = $("#search-box");
const tasks_div = $('#content');
const endpoint = '/tasks/';
const delay_by_in_ms = 700;
let scheduled_function = false;

let ajax_call = function (endpoint, request_parameters) {
  $.getJSON(endpoint, request_parameters)
    .done(response => {
      tasks_div.fadeTo('slow', 0).promise().then(() => {
        tasks_div.html(response['html_from_view']);
        tasks_div.fadeTo('slow', 1);
        search_icon.removeClass('blink');
      });
    });
};

searchBox.on('keyup', function () {
  const request_parameters = {
    keyword: $(this).val()
  };

  if (scheduled_function) {
    clearTimeout(scheduled_function);
  }

  scheduled_function = setTimeout(ajax_call, delay_by_in_ms, endpoint, request_parameters);
});

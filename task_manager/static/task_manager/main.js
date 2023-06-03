  document.addEventListener('DOMContentLoaded', function() {
    var myForm = document.getElementById('create_task');
    var timestampField = document.getElementById('timestampField');

    myForm.addEventListener('submit', function(e) {
      // Get current timestamp
      var timestamp = new Date().toISOString();

      // Set timestamp value to the hidden input field
      timestampField.value = timestamp;
    });
  });


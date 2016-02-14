$(document).ready(function() {

  'use strict';

  var formElement = '.form-element';
  var formResponse = '.form-response';
  var formHoneypot = '.form-honeypot';
  var formSubmit = '.form-submit';

  var signupForm = '.signup-form';
  var signupRequired = '.required-field';
  var signupFormSending = 'Sending...';
  var signupFormSuccess = 'You have been added to our list!';
  var signupFormError = 'Oh boy an error occurred, please try again.';
  var signupFormSubscribed = 'You are already subscribed to our list';
  var signupFormFillFields = 'Please fill out required fields.';
  var signupFormValidEmail = 'Please enter a valid email address.';

  var nanaSubscribe = {
    isValidEmail: function(email) {
      var addressCheck = new RegExp(/^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i);
      return addressCheck.test(email);
    },
    signupForm: function() {
      $(signupForm).submit(function(event) {

        event.preventDefault();

        // References
        var form = $(this);
        var responseMessage = form.parent().find(formResponse);
        var fromElements = form.find(formElement);
        var emailField = form.find('input[type="email"]');
        var honeypot = form.find(formHoneypot);
        var submit = form.find(formSubmit);

        // Check action, method and
        // serialize input
        var formUrl = form.attr('action');
        var formMethod = form.attr('method');
        var formData = form.serialize();

        // Validation flags
        var emptyFields = false;
        var filledFields = false;
        var validEmail = false;

        // Clear error class
        signupRequired = signupRequired.split('.').join('');
        fromElements.removeClass(signupRequired);

        // Empty fields
        fromElements.each(function() {
          if ($(this).attr('required')) {
            if (!$(this).val()) {
              emptyFields = true;
              $(this).addClass(signupRequired);
              responseMessage
                .hide()
                .text(signupFormFillFields)
                .fadeIn(200);
            }
          }
        });
        if (!emptyFields) filledFields = true;

        // Invalid email
        if (emailField.val() && !nanaSubscribe.isValidEmail(emailField.val())) {
          responseMessage
            .hide()
            .text(signupFormValidEmail)
            .fadeIn(200);
          emailField.addClass(signupRequired);
        } else {
          validEmail = true;
        }

        // Check honeypot
        if (honeypot.val() !== '') return false;

        // If empty fields and invalid
        // email merge messages
        if (emptyFields && emailField.val() && !nanaSubscribe.isValidEmail(emailField.val())) {
          responseMessage
            .hide()
            .text(signupFormFillFields + ' ' + signupFormValidEmail)
            .fadeIn(200);
        }
        if (filledFields && validEmail) {

          // Change submit text
          var submitValue = $(submit).val();
          $(submit).attr('disabled', true);

          // Sending Message
          responseMessage
            .hide()
            .text(signupFormSending)
            .fadeIn(200);

          // Send
          $.ajax({
            url: formUrl,
            type: formMethod,
            data: formData,
            dataType: 'json'
          }).done(function(data) {
            try {
              if (data.response === true) {
                $(submit).addClass('clicked');
                $(submit).find('p').text('Done!');
								responseMessage.remove();
                fromElements.val('');
              } else {

                // Set error message
                responseMessage
                  .hide()
                  .text(data.json.error_message)
                  .fadeIn(200);
              }
            } catch (e) {
              console.log('error in parsing returned ajax data: ' + e);

              // Set error message
              responseMessage
                .hide()
                .text('Error occurred. Please see the console for details.')
                .fadeIn(200);
            }
          }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log('Error occured in processing your request:');
            console.log(jqXHR);
            console.log('Text status');
            console.log(textStatus);
            console.log('Error thrown');
            console.log(errorThrown);
            console.log('Servre response');
            console.log(jqXHR.status);
            console.log('Response Text may contain error output from PHP');
            console.log(jqXHR.responseText);

            // Set error message
            responseMessage
              .hide()
              .text(signupFormError + textStatus + ' (' + errorThrown + ')')
              .fadeIn(200);
          }).always(function() {

          });
        }
      });
    }
  };

  nanaSubscribe.signupForm();

  $('.feature-column').on('mouseenter', function(){
    $(this).find('.feature-icon').addClass('active');
  });

  $('.feature-column').on('mouseleave', function(){
    $(this).find('.feature-icon').removeClass('active');
  });

});

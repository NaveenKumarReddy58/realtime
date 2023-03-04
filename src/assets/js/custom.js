jQuery(document).ready(function ($) {
  $(".Pro_input_Field_Phone").intlTelInput({
    separateDialCode: true,
  });

  setTimeout(function () {
    $(".Pro_input_Field_Phone").intlTelInput({
      separateDialCode: true,
    });
    console.log("intlTelInput");
  }, 2000);
});

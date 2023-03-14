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

  setInterval(() => {
    $(".Pro_input_Field_Phone").intlTelInput({
      separateDialCode: true,
    });
  }, 1000);



  $(".side_menu").click(function(){
    $(".main_box").toggleClass("main");
  }); 

});

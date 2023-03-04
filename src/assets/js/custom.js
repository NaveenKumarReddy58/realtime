jQuery(document).ready(function ($) {
  setTimeout(function () {
    $("#phone").intlTelInput();
    console.log('setTimeout');
  }, 2000);
});

$(document).ready(function() {

  $.post("/", {token: window.localStorage.getItem("token")}).then(function(data){


    if (!data){

      window.localStorage.clear();

    }
    else {

      $('#navLogin').html(data.username + "&nbsp;&nbsp;");
      $('#navLogin').attr("href", "/profile");
      $('#navSignup').html("Sign Out");
      $('#navSignup').attr({"href": "/", "id":"logOutBtn"});
      $('#logOutBtn').on("click", function(){

        window.localStorage.clear();

      });
    }
  });
  // parallax image js
  $('.parallax').parallax();
  // miles dropdown
  $('select').material_select();
  //modals
  $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
    });

// Scroll to items function ------------
var card = $("#carditem");
var submit = $("#submit-search");

  $('#textarea1').val('New Text');
  $('#textarea1').trigger('autoresize');
});

// Materialize.scrollFire(options);

$(document).on("click", "#loginBtn", handleUserLogin);
$(document).on("click", "#signupBtn", handleUserFormSubmit);

  function handleUserLogin(event){
    event.preventDefault();

    var userName = $("#usernameLogin");
    var passWord = $("#passwordLogin");


    userLoginInfo({
      userName: userName.val().trim(),
      passWord: passWord.val().trim(),
    });
  }

  function userLoginInfo(LoginData){

    $.post("/api/login", LoginData).done(function(response){

      if (response[0] === 1) {

        $.get("/api/loginInfo", LoginData).done(function(response2){

          window.localStorage.setItem("token", response2.token);
          window.localStorage.setItem("profileID", response2.id);
          window.location = "/profile/";
        });
      }
      else {
        swal("Error!", "Account Not Found", "error");
      }
    });

  }


  function handleUserFormSubmit(event) {
    event.preventDefault();

    var fNameInput = $("#firstName");
    var lNameInput = $("#lastName");
    var emailInput = $("#email");
    var phoneInput = $("#phone");
    var cityInput = $("#city");
    var stateInput = $("#state");
    var zipInput = $("#zipcode");
    var userNameInput = $("#username");
    var passwordInput = $("#password");

    upsertUser({
      firstName: fNameInput.val().trim(),
      lastName: lNameInput.val().trim(),
      email: emailInput.val().trim(),
      phone: phoneInput.val().trim(),
      city: cityInput.val().trim(),
      state: stateInput.val().trim(),
      zipcode: zipInput.val().trim(),
      username: userNameInput.val().trim(),
      pw: passwordInput.val().trim()
    });
  }


  function upsertUser(UserData) {
    $.post("/findDuplicate/", {
      username: UserData.username,
      email: UserData.email
      }).then(function(data){
        console.log(data);

    if (!data[0]) {
    $.post("/api/isloggedin", UserData).done(function(res)
      {
        window.localStorage.setItem("token", res.token);
        window.localStorage.setItem("profileID", res.id);
        window.location = "/profile/";
      });
    }
    else {

      alert("Username and/or Email already exists");
    }
    });
  };


  // Item search functionality
  $(document).on("click", "#submit-search", function(event){
    event.preventDefault();
    $('select').material_select();
    var cat= ($('#stuffCat :selected').val());
    var rad=($('.mileSearch :selected').val());
    var zip = $('#searchZip').val();
    console.log(cat, zip, rad);

    $('.body_content').empty();

    $.get("/results/" + cat + "/" + rad + "/" + zip , function(data){
    for (var i = 0; i < data.length; i++) {

    var cards;

    cards = '<div class="col s12 m3">' +
    '<a href="/listing/'+ data[i].id + '"><div class="card card hoverable z-depth-2" id="card">' +
    '<div class="card-image">' +
    '<img src="'+ data[i].item_img1 +'">'  +
    // '<span class="card-title">' + data[i].zipcode + '</span>' +
    '</div>' +
    '<div class="card-content">' +
    '<span id="title"class="card-title"><h5>'+ data[i].item_name +'</h5></span>' +
    '</div></a>' +
    '</div>' +
    '</div>';

    console.log(cards);
    $('.body_content').append(cards);

  }


  });

});
